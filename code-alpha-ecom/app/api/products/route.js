import connectDB from "@/lib/db";
import Product from "@/model/product";

export async function GET(request) {
    await connectDB();
    const products = await Product.find();
    return new Response(JSON.stringify(products), { status: 200 });
}
