import { Router } from "express";
import { transaksiController } from "./transaksi.controller";
import { requireTabunganAccess } from "../authentication/auth.middleware";

export const transaksiRoutes = Router();

transaksiRoutes.post("/:tabunganId/setor", requireTabunganAccess("tabunganId"), transaksiController.setoran);
transaksiRoutes.post("/:tabunganId/penarikan", requireTabunganAccess("tabunganId"), transaksiController.penarikan);
transaksiRoutes.get("/:tabunganId/mutasi", requireTabunganAccess("tabunganId"), transaksiController.findByTabungan);
transaksiRoutes.get("/:tabunganId/mutasi/:id", requireTabunganAccess("tabunganId"), transaksiController.findById);
