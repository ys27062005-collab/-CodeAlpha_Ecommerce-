import connectDB from "@/lib/db";
import Product from "@/model/product";

function cosineSimilarity(a, b) {
    let dot = 0;
    let na = 0;
    let nb = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    if (na === 0 || nb === 0) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function getOpenAIEmbeddings(inputs, apiKey) {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model: "text-embedding-3-small", input: inputs }),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`OpenAI Embeddings error: ${res.status} ${err}`);
    }
    const data = await res.json();
    return data.data.map((d) => d.embedding);
}

export async function POST(request) {
    try {
        const { query, limit = 10 } = await request.json();

        if (!query) {
            return Response.json({ error: "Query is required" }, { status: 400 });
        }

        await connectDB();

        const OPENAI_KEY = process.env.OPENAI_API_KEY || null;

        // If OpenAI key provided, perform semantic search using embeddings
        if (OPENAI_KEY) {
            // fetch a reasonable number of products to compare (avoid huge payloads)
            const products = await Product.find({}).limit(200).lean();

            // build texts (title + category + description)
            const texts = products.map((p) => `${p.title || ''} \n${p.category || ''} \n${p.description || ''}`);

            // compute embeddings for query and product texts in a single call
            const inputs = [query, ...texts];
            const embeddings = await getOpenAIEmbeddings(inputs, OPENAI_KEY);

            const queryEmb = embeddings[0];
            const prodEmbs = embeddings.slice(1);

            const scored = products.map((p, idx) => ({
                product: p,
                score: cosineSimilarity(queryEmb, prodEmbs[idx]),
            }));

            scored.sort((a, b) => b.score - a.score);

            const top = scored.slice(0, limit).map((s) => ({ ...s.product, _score: s.score }));
            return Response.json(top);
        }

        // Fallback: regex-based search (original behavior)
        // Fallback: local semantic search using TF-IDF (no external API key required)
        const products = await Product.find({}).limit(200).lean();

        // build documents (title + category + description)
        const docs = products.map((p) => `${p.title || ''} ${p.category || ''} ${p.description || ''}`);

        // simple tokenizer
        const tokenize = (text) => {
            return (text || '')
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, ' ')
                .split(/\s+/)
                .filter(Boolean);
        };

        // build vocabulary
        const vocabMap = new Map();
        const docTerms = docs.map((d) => {
            const tokens = tokenize(d);
            const tf = new Map();
            tokens.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
            for (const term of tf.keys()) {
                if (!vocabMap.has(term)) vocabMap.set(term, vocabMap.size);
            }
            return tf;
        });

        const vocabSize = vocabMap.size;

        // compute idf
        const idf = new Array(vocabSize).fill(0);
        for (const [, idx] of vocabMap) idf[idx] = 0; // ensure length
        docTerms.forEach((tf) => {
            for (const term of tf.keys()) {
                const idx = vocabMap.get(term);
                idf[idx] += 1;
            }
        });
        for (let i = 0; i < idf.length; i++) {
            idf[i] = Math.log((1 + docs.length) / (1 + idf[i])) + 1;
        }

        // helper to create tf-idf vector
        const makeVector = (tf) => {
            const vec = new Array(vocabSize).fill(0);
            for (const [term, count] of tf.entries()) {
                const idx = vocabMap.get(term);
                if (idx !== undefined) vec[idx] = count * idf[idx];
            }
            return vec;
        };

        const docVectors = docTerms.map((tf) => makeVector(tf));

        // query vector
        const qTokens = tokenize(query);
        const qtf = new Map();
        qTokens.forEach((t) => qtf.set(t, (qtf.get(t) || 0) + 1));
        const qVec = makeVector(qtf);

        // compute cosine similarities
        const similarities = docVectors.map((vec, i) => {
            let dot = 0,
                na = 0,
                nb = 0;
            for (let j = 0; j < vec.length; j++) {
                dot += vec[j] * qVec[j];
                na += vec[j] * vec[j];
                nb += qVec[j] * qVec[j];
            }
            const score = na === 0 || nb === 0 ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb));
            return { idx: i, score };
        });

        similarities.sort((a, b) => b.score - a.score);
        const top = similarities.slice(0, limit).map((s) => ({ ...products[s.idx], _score: s.score }));
        return Response.json(top);
    } catch (error) {
        console.error("AI Search Error:", error);
        return Response.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
