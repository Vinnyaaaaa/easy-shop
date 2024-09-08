import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { createResponse, getRandomCode } from "../utils";
import { redisClient } from "../config/db";
import { sendEmail } from "./emailController";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(200)
        .json(createResponse(40001, "email already exists", {})); // 用户已存在
    }

    user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    await redisClient.set(`token:${user._id}`, token);

    res.status(200).json(
      createResponse(0, "create success", { token, email: user.email }) //注册成功
    );
  } catch (error) {
    console.log("error", error);
    res.status(500).json(createResponse(500, "create failed", {}));
  }
};

export const sendVerifyCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(200)
        .json(createResponse(40001, "email already exists", {}));
    }

    const code = getRandomCode();
    await sendEmail(req.body, code);
    await redisClient.set(`code:${email}`, code, {
      EX: 60 * 2,
      NX: true,
    });
    res.sendStatus(200).json(createResponse(0, "send code success", {}));
  } catch (error) {
    res.sendStatus(500).json(createResponse(500, "send code failed", {}));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json(createResponse(40002, "user not found", {})); // 找不到用户
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(200)
        .json(createResponse(40003, "invalid credentials", {})); //用户名或密码错误
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    await redisClient.set(`token:${user._id}`, token);

    res.json(createResponse(0, "login success", { token, email: user.email }));
  } catch (error) {
    console.log("error", error);
    res.status(500).json(createResponse(500, "login failed", {}));
  }
};
