import mongoose, { Document } from "mongoose";

interface Product extends Document {
  name: string;
  price: number;
  stock: number;
  category: string;
  createdBy: mongoose.Types.ObjectId;
}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  describe: { type: String, required: false },
  category: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Product = mongoose.model<Product>("Product", productSchema);

export default Product;
