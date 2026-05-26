import { Router } from "express";
import { transaksiController } from "./transaksi.controller";

export const transaksiRoutes = Router();

transaksiRoutes.post("/:tabunganId/setoran", transaksiController.setoran);
transaksiRoutes.post("/:tabunganId/penarikan", transaksiController.penarikan);
transaksiRoutes.get("/:tabunganId/transaksi", transaksiController.findByTabungan);
transaksiRoutes.get("/:tabunganId/transaksi/:id", transaksiController.findById);
