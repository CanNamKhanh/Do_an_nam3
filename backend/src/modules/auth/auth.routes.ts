import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../../middlewares/authenticate";
import * as authController from "./auth.controller";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Đăng nhập sai quá nhiều lần, thử lại sau 15 phút" },
});

export const authRouter = Router();

authRouter.post("/login", loginLimiter, authController.login);
authRouter.get("/me", authenticate, authController.me);
