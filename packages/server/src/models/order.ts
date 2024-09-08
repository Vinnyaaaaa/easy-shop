// models/Order.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  trackingNumber?: string;
}

const OrderSchema: Schema = new Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered"],
      default: "pending",
    },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
