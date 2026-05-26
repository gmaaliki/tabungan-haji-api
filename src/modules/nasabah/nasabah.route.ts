import { Router } from "express";
import { nasabahController } from "./nasabah.controller";
import { tabunganController } from "../tabungan/tabungan.controller";

export const nasabahRoutes = Router();

nasabahRoutes.post("/", nasabahController.create);
nasabahRoutes.get("/", nasabahController.findAll);
nasabahRoutes.post("/:nasabahId/tabungan", tabunganController.create);
nasabahRoutes.get("/:nasabahId/tabungan", tabunganController.findByNasabah);
nasabahRoutes.get("/:id", nasabahController.findById);
nasabahRoutes.patch("/:id", nasabahController.update);
nasabahRoutes.delete("/:id", nasabahController.delete);
