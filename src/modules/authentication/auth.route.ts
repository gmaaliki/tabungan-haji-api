import { Router } from "express";
import { authController } from "./auth.controller";
import { requireAuth, authorize } from "./auth.middleware";

export const authRoutes = Router();

authRoutes.post("/register", requireAuth, authorize("ADMIN"), authController.register);
authRoutes.post("/login", authController.login);
authRoutes.get("/me", requireAuth, authController.me);
authRoutes.post("/logout", requireAuth, authController.logout);
