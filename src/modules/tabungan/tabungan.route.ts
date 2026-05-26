import { Router } from "express";
import { tabunganController } from "./tabungan.controller";

export const tabunganRoutes = Router();

tabunganRoutes.get("/", tabunganController.findAll);
tabunganRoutes.get("/:id", tabunganController.findById);
tabunganRoutes.patch("/:id/status", tabunganController.updateStatus);
tabunganRoutes.delete("/:id", tabunganController.delete);
