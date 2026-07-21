import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: String,
    image: String,
    stock: { type: Number, default: 0 },
});
export default mongoose.models.Product || mongoose.model("Product", productSchema);