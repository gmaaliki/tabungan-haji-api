import { Router } from "express";
import { laporanController } from "./laporan.controller";
import { authorize, requireTabunganAccess } from "../authentication/auth.middleware";

export const laporanRoutes = Router();

laporanRoutes.get("/transaksi/saya/:tabunganId", requireTabunganAccess("tabunganId"), laporanController.transaksiSaya);
laporanRoutes.get("/transaksi/tabungan/:tabunganId", authorize("ADMIN"), laporanController.transaksiTabungan);
laporanRoutes.get("/transaksi", authorize("ADMIN"), laporanController.transaksiSemua);
