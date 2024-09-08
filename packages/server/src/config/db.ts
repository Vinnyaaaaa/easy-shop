import mongoose from "mongoose";
import { createClient } from "redis";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
});

redisClient.on("error", (error) => console.log("Redis Client Error", error));

export const connectRedis = async () => {
  await redisClient.connect();

  console.log("Connected to Redis");
};
