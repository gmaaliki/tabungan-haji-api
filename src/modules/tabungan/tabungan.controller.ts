import type { Request, Response } from "express";
import { UpdateStatusTabunganSchema } from "./tabungan.schema";
import { tabunganService } from "./tabungan.service";

export const tabunganController = {
    async create(req: Request, res: Response) {
        try {
            const tabungan = await tabunganService.create(req.params.nasabahId);
            return res.status(201).json({ data: tabungan, message: "Rekening tabungan haji berhasil dibuka" });
        } catch (err: any) {
            if (err.code === "NASABAH_NOT_FOUND") return res.status(404).json({ error: "NOT_FOUND", message: err.message });
            throw err;
        }
    },

    async findAll(req: Request, res: Response) {
        const data = await tabunganService.findAll();
        return res.status(200).json({ data, total: data.length, message: "OK" });
    },

    async findById(req: Request, res: Response) {
        const tabungan = await tabunganService.findById(req.params.id);
        if (!tabungan) {
            return res.status(404).json({ error: "NOT_FOUND", message: "Rekening tabungan tidak ditemukan" });
        }
        return res.status(200).json({ data: tabungan, message: "OK" });
    },

    async findByNasabah(req: Request, res: Response) {
        const data = await tabunganService.findByNasabah(req.params.nasabahId);
        return res.status(200).json({ data, total: data.length, message: "OK" });
    },

    async updateStatus(req: Request, res: Response) {
        const parsed = UpdateStatusTabunganSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: "VALIDATION_ERR", details: parsed.error.flatten() });
        }
        try {
            const tabungan = await tabunganService.updateStatus(req.params.id, parsed.data);
            return res.status(200).json({ data: tabungan, message: "Status rekening berhasil diperbarui" });
        } catch (err: any) {
            if (err.code === "NOT_FOUND") return res.status(404).json({ error: "NOT_FOUND", message: err.message });
            if (err.code === "ALREADY_CLOSED") return res.status(422).json({ error: "ALREADY_CLOSED", message: err.message });
            throw err;
        }
    },

    async delete(req: Request, res: Response) {
        try {
            await tabunganService.delete(req.params.id);
            return res.status(200).json({ message: "Rekening tabungan berhasil dihapus" });
        } catch (err: any) {
            if (err.code === "NOT_FOUND") return res.status(404).json({ error: "NOT_FOUND", message: err.message });
            if (err.code === "HAS_SALDO") return res.status(422).json({ error: "HAS_SALDO", message: err.message });
            if (err.code === "HAS_TRANSAKSI") return res.status(409).json({ error: "HAS_TRANSAKSI", message: err.message });
            throw err;
        }
    },
};
