import { Router } from "express";
import { nasabahController } from "./nasabah.controller";
import { tabunganController } from "../tabungan/tabungan.controller";
import { authorize, requireNasabahAccess } from "../authentication/auth.middleware";

export const nasabahRoutes = Router();

nasabahRoutes.post("/", nasabahController.create);
nasabahRoutes.get("/", authorize("ADMIN"), nasabahController.findAll);
nasabahRoutes.get("/:nasabahId/tabungan", requireNasabahAccess("nasabahId"), tabunganController.findByNasabah);
nasabahRoutes.get("/:id", requireNasabahAccess("id"), nasabahController.findById);
nasabahRoutes.patch("/:id", requireNasabahAccess("id"), nasabahController.update);
nasabahRoutes.delete("/:id", authorize("ADMIN"), nasabahController.delete);
