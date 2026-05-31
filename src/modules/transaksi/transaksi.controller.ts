import type { Request, Response } from "express";
import { SetoranSchema, PenarikanSchema } from "./transaksi.schema";
import { transaksiService } from "./transaksi.service";

export const transaksiController = {
  async setoran(req: Request<{ tabunganId: string }>, res: Response) {
    const parsed = SetoranSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "VALIDATION_ERR", details: parsed.error.flatten() });
    }
    try {
      const idempotencyKey = req.header("Idempotency-Key") || undefined;
      const result = await transaksiService.setoran(
        req.params.tabunganId,
        parsed.data.nominal,
        parsed.data.metode,
        idempotencyKey
      );
      const status = result.replayed ? 200 : 201;
      const message = result.replayed
        ? "Setoran sudah diproses sebelumnya"
        : "Setoran berhasil";
      return res.status(status).json({ data: result, message });
    } catch (err: any) {
      if (err.code === "TABUNGAN_NOT_FOUND")
        return res
          .status(404)
          .json({ error: "NOT_FOUND", message: err.message });
      if (err.code === "TABUNGAN_NOT_ACTIVE")
        return res
          .status(422)
          .json({ error: "TABUNGAN_NOT_ACTIVE", message: err.message });
      throw err;
    }
  },

  async penarikan(req: Request<{ tabunganId: string }>, res: Response) {
    const parsed = PenarikanSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "VALIDATION_ERR", details: parsed.error.flatten() });
    }
    try {
      const result = await transaksiService.penarikan(
        req.params.tabunganId,
        parsed.data.nominal,
        parsed.data.metode
      );
      return res
        .status(201)
        .json({ data: result, message: "Penarikan berhasil" });
    } catch (err: any) {
      if (err.code === "TABUNGAN_NOT_FOUND")
        return res
          .status(404)
          .json({ error: "NOT_FOUND", message: err.message });
      if (err.code === "TABUNGAN_NOT_ACTIVE")
        return res
          .status(422)
          .json({ error: "TABUNGAN_NOT_ACTIVE", message: err.message });
      if (err.code === "INSUFFICIENT_BALANCE")
        return res
          .status(422)
          .json({ error: "INSUFFICIENT_BALANCE", message: err.message });
      throw err;
    }
  },

  async findByTabungan(req: Request<{ tabunganId: string }>, res: Response) {
    const raw = req.query.limit;
    const parsed = typeof raw === "string" ? parseInt(raw, 10) : NaN;
    const limit =
      Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 200) : undefined;
    const data = await transaksiService.findByTabungan(req.params.tabunganId, {
      limit,
    });
    return res.status(200).json({ data, total: data.length, message: "OK" });
  },

  async findById(
    req: Request<{ tabunganId: string; id: string }>,
    res: Response
  ) {
    const transaksi = await transaksiService.findById(req.params.id);
    if (!transaksi) {
      return res
        .status(404)
        .json({ error: "NOT_FOUND", message: "Transaksi tidak ditemukan" });
    }
    return res.status(200).json({ data: transaksi, message: "OK" });
  },
};
