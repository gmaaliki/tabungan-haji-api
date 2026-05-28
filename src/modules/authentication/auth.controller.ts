import type { Request, Response } from "express";
import { RegisterSchema, LoginSchema } from "./auth.schema";
import { authService } from "./auth.service";

export const authController = {
    async register(req: Request, res: Response) {
        const parsed = RegisterSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: "VALIDATION_ERR", details: parsed.error.flatten() });
        }
        try {
            const user = await authService.register(parsed.data);
            return res.status(201).json({ data: user, message: "Registrasi berhasil" });
        } catch (err: any) {
            if (err.code === "P2002") {
                return res.status(409).json({ error: "DUPLICATE_ENTRY", message: "Email sudah terdaftar" });
            }
            throw err;
        }
    },

    async login(req: Request, res: Response) {
        const parsed = LoginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: "VALIDATION_ERR", details: parsed.error.flatten() });
        }
        try {
            const result = await authService.login(parsed.data);
            return res.status(200).json({ data: result, message: "Login berhasil" });
        } catch (err: any) {
            if (err.code === "INVALID_CREDENTIALS") {
                return res.status(401).json({ error: "INVALID_CREDENTIALS", message: err.message });
            }
            throw err;
        }
    },

    async logout(req: Request, res: Response) {
        if (!req.user) {
            return res.status(401).json({ error: "UNAUTHORIZED", message: "Token tidak ditemukan" });
        }
        await authService.logout(req.user);
        return res.status(200).json({ message: "Logout berhasil" });
    },
};
