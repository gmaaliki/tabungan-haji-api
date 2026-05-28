import { Router } from "express";
import { nasabahController } from "./nasabah.controller";
import { tabunganController } from "../tabungan/tabungan.controller";
import { requireAuth, authorize, requireNasabahAccess } from "../authentication/auth.middleware";

export const nasabahRoutes = Router();

nasabahRoutes.post("/", nasabahController.create);
nasabahRoutes.get("/", requireAuth, authorize("ADMIN"), nasabahController.findAll);
nasabahRoutes.get("/:nasabahId/tabungan", requireAuth, requireNasabahAccess("nasabahId"), tabunganController.findByNasabah);
nasabahRoutes.get("/:id", requireAuth, requireNasabahAccess("id"), nasabahController.findById);
nasabahRoutes.patch("/:id", requireAuth, requireNasabahAccess("id"), nasabahController.update);
nasabahRoutes.delete("/:id", requireAuth, authorize("ADMIN"), nasabahController.delete);
