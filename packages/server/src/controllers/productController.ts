import { Request, Response } from "express";
import Product from "../models/product";
import { createResponse } from "../utils";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, stock, category, userId } = req.body;
    const product = new Product({
      name,
      price,
      stock,
      category,
      createdBy: userId,
    });
    await product.save();
    res.status(201).json(createResponse(0, "success", { product }));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(createResponse(0, "success", { products }));
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });
    res.json(createResponse(0, "success", { products }));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const purchaseProduct = async (req: Request, res: Response) => {
  try {
    const { purchases } = req.body;
    const purchaseFailed = [];
    const purchaseSuccess = [];

    for (const productId of purchases) {
      const product = await Product.findById(productId);
      if (!product) {
        purchaseFailed.push({
          productId,
          message: "Product not found",
          code: 41001,
        });
        continue;
      }

      if (product.stock <= 0) {
        purchaseFailed.push({
          productId,
          message: "Out of stock",
          code: 40002,
        });
        continue;
      }

      // 使用 MongoDB 的原子操作来更新库存
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gt: 0 } },
        { $inc: { stock: -1 } },
        { new: true }
      );

      if (!updatedProduct) {
        purchaseFailed.push({
          productId,
          message: "Out of stock",
          code: 40002,
        });
      } else {
        purchaseSuccess.push({
          productId,
          message: "success",
          code: 0,
        });
      }
    }

    // const product = await Product.findById(productId);

    // if (!product) {
    //   return res
    //     .status(200)
    //     .json(createResponse(41001, "Product not found", {}));
    // }

    // if (product.stock <= 0) {
    //   return res.status(200).json(createResponse(40002, "Out of stock", {}));
    // }

    // // 使用 MongoDB 的原子操作来更新库存
    // const updatedProduct = await Product.findOneAndUpdate(
    //   { _id: productId, stock: { $gt: 0 } },
    //   { $inc: { stock: -1 } },
    //   { new: true }
    // );

    // if (!updatedProduct) {
    //   return res.status(200).json(createResponse(40002, "Out of stock", {}));
    // }

    // const products = await Product.find();
    // res.json(createResponse(0, "success", { products }));
    res.json(createResponse(0, "success", { purchaseFailed, purchaseSuccess }));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
