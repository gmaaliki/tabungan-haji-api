import type { Request, Response } from "express";
import { CreateNasabahSchema, UpdateNasabahSchema } from "./nasabah.schema";
import { nasabahService } from "./nasabah.service";

function duplicateResponse(res: Response, err: any) {
    const target = err.meta?.target;
    const targetStr = Array.isArray(target) ? target.join(",") : String(target ?? "");
    if (targetStr.includes("user")) {
        return res.status(409).json({ error: "ALREADY_REGISTERED", message: "Anda sudah terdaftar sebagai nasabah" });
    }
    if (targetStr.includes("nik")) {
        return res.status(409).json({ error: "DUPLICATE_ENTRY", message: "NIK sudah terdaftar" });
    }
    if (targetStr.includes("email")) {
        return res.status(409).json({ error: "DUPLICATE_ENTRY", message: "Email sudah terdaftar" });
    }
    return res.status(409).json({ error: "DUPLICATE_ENTRY", message: "Data sudah terdaftar" });
}

export const nasabahController = {
    async create(req: Request, res: Response) {
        const parsed = CreateNasabahSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: "VALIDATION_ERR", details: parsed.error.flatten() });
        }
        try {
            const nasabah = await nasabahService.create(parsed.data);
            return res.status(201).json({ data: nasabah, message: "Nasabah berhasil didaftarkan" });
        } catch (err: any) {
            if (err.code === "P2002") return duplicateResponse(res, err);
            throw err;
        }
    },

    async findAll(req: Request, res: Response) {
        const data = await nasabahService.findAll();
        return res.status(200).json({ data, total: data.length, message: "OK" });
    },

    async findById(req: Request<{ id: string }>, res: Response) {
        const nasabah = await nasabahService.findById(req.params.id);
        if (!nasabah) {
            return res.status(404).json({ error: "NOT_FOUND", message: "Nasabah tidak ditemukan" });
        }
        return res.status(200).json({ data: nasabah, message: "OK" });
    },

    async update(req: Request<{ id: string }>, res: Response) {
        const parsed = UpdateNasabahSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: "VALIDATION_ERR", details: parsed.error.flatten() });
        }
        try {
            const nasabah = await nasabahService.update(req.params.id, parsed.data);
            return res.status(200).json({ data: nasabah, message: "Data nasabah berhasil diperbarui" });
        } catch (err: any) {
            if (err.code === "EMPTY_UPDATE") return res.status(400).json({ error: "EMPTY_UPDATE", message: err.message });
            if (err.code === "NOT_FOUND" || err.code === "P2025") return res.status(404).json({ error: "NOT_FOUND", message: "Nasabah tidak ditemukan" });
            if (err.code === "P2002") return duplicateResponse(res, err);
            throw err;
        }
    },

    async delete(req: Request<{ id: string }>, res: Response) {
        try {
            await nasabahService.delete(req.params.id);
            return res.status(200).json({ message: "Nasabah berhasil dihapus" });
        } catch (err: any) {
            if (err.code === "NOT_FOUND" || err.code === "P2025") return res.status(404).json({ error: "NOT_FOUND", message: "Nasabah tidak ditemukan" });
            throw err;
        }
    },
};
