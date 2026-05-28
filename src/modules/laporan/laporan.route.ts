import { Router } from "express";
import { laporanController } from "./laporan.controller";
import { authorize } from "../authentication/auth.middleware";

export const laporanRoutes = Router();

laporanRoutes.get("/transaksi/saya", laporanController.transaksiSaya);
laporanRoutes.get("/transaksi", authorize("ADMIN"), laporanController.transaksiSemua);
