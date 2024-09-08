import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, connectRedis } from "./config/db";
import userRoutes from "./routers/userRouters";
import productRoutes from "./routers/productRouters";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await connectRedis();

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
