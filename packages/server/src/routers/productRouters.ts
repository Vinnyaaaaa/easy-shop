import express from "express";
import {
  createProduct,
  getProducts,
  searchProducts,
  purchaseProduct,
} from "../controllers/productController";
import auth from "../middleware/auth";

const productRoutes = express.Router();

productRoutes.post("/", auth, createProduct);
productRoutes.get("/", auth, getProducts);
productRoutes.get("/search", auth, searchProducts);
productRoutes.post("/buy", auth, purchaseProduct);

export default productRoutes;
