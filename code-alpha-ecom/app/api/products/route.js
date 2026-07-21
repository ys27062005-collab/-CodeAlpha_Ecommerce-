import connectDB from "@/lib/db";
import Product from "@/model/product";

export async function GET(request) {
    try {
        await connectDB();
        const products = await Product.find();
        return new Response(JSON.stringify(products), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("/api/products error:", error);
        const body = { error: error.message || "Internal Server Error" };
        return new Response(JSON.stringify(body), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
