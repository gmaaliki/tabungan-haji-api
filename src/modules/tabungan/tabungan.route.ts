import { Router } from "express";
import { tabunganController } from "./tabungan.controller";
import { authorize, requireTabunganAccess } from "../authentication/auth.middleware";

export const tabunganRoutes = Router();

tabunganRoutes.post("/", tabunganController.create);
tabunganRoutes.get("/", authorize("ADMIN"), tabunganController.findAll);
tabunganRoutes.get("/:id", requireTabunganAccess("id"), tabunganController.findById);
tabunganRoutes.get("/:id/estimasi", requireTabunganAccess("id"), tabunganController.estimasi);
tabunganRoutes.patch("/:id/status", authorize("ADMIN"), tabunganController.updateStatus);
tabunganRoutes.patch("/:id/tanggal-daftar", requireTabunganAccess("id"), tabunganController.updateTanggalDaftar);
tabunganRoutes.delete("/:id", authorize("ADMIN"), tabunganController.delete);
