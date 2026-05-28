import type { Request, Response } from "express";
import { LaporanQuerySchema, type LaporanQueryInput } from "./laporan.schema";
import { laporanService } from "./laporan.service";

const BOM = "﻿";

function resolvePeriode(q: LaporanQueryInput) {
    const now = new Date();
    return {
        tahun: q.tahun ?? now.getUTCFullYear(),
        bulan: q.bulan ?? now.getUTCMonth() + 1,
    };
}

function sendCsv(res: Response, filename: string, csv: string) {
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(BOM + csv);
}

export const laporanController = {
    async transaksiSaya(req: Request, res: Response) {
        const parsed = LaporanQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: "VALIDATION_ERR", details: parsed.error.flatten() });
        }
        const { tahun, bulan } = resolvePeriode(parsed.data);
        const csv = await laporanService.transaksiBulananCsv(tahun, bulan, req.user!.sub);
        const periode = `${tahun}-${String(bulan).padStart(2, "0")}`;
        return sendCsv(res, `laporan-transaksi-saya-${periode}.csv`, csv);
    },

    async transaksiSemua(req: Request, res: Response) {
        const parsed = LaporanQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: "VALIDATION_ERR", details: parsed.error.flatten() });
        }
        const { tahun, bulan } = resolvePeriode(parsed.data);
        const csv = await laporanService.transaksiBulananCsv(tahun, bulan);
        const periode = `${tahun}-${String(bulan).padStart(2, "0")}`;
        return sendCsv(res, `laporan-transaksi-semua-${periode}.csv`, csv);
    },
};
