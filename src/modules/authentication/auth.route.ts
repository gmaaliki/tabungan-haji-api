import { Router } from "express";
import { authController } from "./auth.controller";
import { requireAuth } from "./auth.middleware";

export const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/logout", requireAuth, authController.logout);
