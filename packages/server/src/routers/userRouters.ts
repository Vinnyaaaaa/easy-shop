import express from "express";
import { register, login, sendVerifyCode } from "../controllers/userController";

const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.post("/verify-code", sendVerifyCode);

export default userRoutes;
