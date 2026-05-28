import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { authService, type AuthPayload } from "./auth.service";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "UNAUTHORIZED", message: "Token tidak ditemukan" });
    }

    const token = header.slice(7);
    let payload: AuthPayload;
    try {
        payload = authService.verifyToken(token);
    } catch {
        return res.status(401).json({ error: "INVALID_TOKEN", message: "Token tidak valid atau kadaluarsa" });
    }

    if (await authService.isTokenRevoked(payload.jti)) {
        return res.status(401).json({ error: "TOKEN_REVOKED", message: "Token sudah tidak berlaku" });
    }

    req.user = payload;
    next();
}

export function authorize(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: "UNAUTHORIZED", message: "Token tidak ditemukan" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "FORBIDDEN", message: "Akses ditolak" });
        }
        next();
    };
}

export function requireNasabahAccess(param: string = "id") {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: "UNAUTHORIZED", message: "Token tidak ditemukan" });
        }
        if (req.user.role === "ADMIN") return next();

        const nasabah = await prisma.nasabah.findUnique({ where: { id: String(req.params[param]) } });
        if (!nasabah) {
            return res.status(404).json({ error: "NOT_FOUND", message: "Nasabah tidak ditemukan" });
        }
        if (nasabah.userId !== req.user.sub) {
            return res.status(403).json({ error: "FORBIDDEN", message: "Akses ditolak" });
        }
        next();
    };
}

export function requireTabunganAccess(param: string = "id") {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: "UNAUTHORIZED", message: "Token tidak ditemukan" });
        }
        if (req.user.role === "ADMIN") return next();

        const tabungan = await prisma.tabunganHaji.findUnique({
            where: { id: String(req.params[param]) },
            include: { nasabah: true },
        });
        if (!tabungan) {
            return res.status(404).json({ error: "NOT_FOUND", message: "Rekening tabungan tidak ditemukan" });
        }
        if (tabungan.nasabah.userId !== req.user.sub) {
            return res.status(403).json({ error: "FORBIDDEN", message: "Akses ditolak" });
        }
        next();
    };
}
