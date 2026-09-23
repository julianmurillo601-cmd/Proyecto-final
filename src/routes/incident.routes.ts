import { Router } from "express";
import {
  createIncident,
  deleteIncident,
  getAllIncidents,
  getCriticalIncidents,
  getIncidentById,
  getIncidentStats,
  getPendingIncidents,
  updateIncident,
  updateIncidentStatus
} from "../controllers/incident.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateId } from "../middlewares/validate-id.middleware";
import {
  validateCreateIncident,
  validateUpdateIncident
} from "../middlewares/validate-incident.middleware";
import { validatePriority } from "../middlewares/validate-priority.middleware";
import { validateStatus } from "../middlewares/validate-status.middleware";
import { validateTime } from "../middlewares/validate-time.middleware";

const router = Router();

// Lecturas públicas.
// IMPORTANTE: /critical, /pending y /stats van ANTES de /:id, o Express
// interpretaría "critical" como un id.
router.get("/", getAllIncidents);
router.get("/critical", getCriticalIncidents);
router.get("/pending", getPendingIncidents);
router.get("/stats", getIncidentStats);
router.get("/:id", validateId, getIncidentById);

// Escrituras protegidas (cualquier token válido)
router.post(
  "/",
  authMiddleware,
  validateCreateIncident,
  validatePriority,
  validateTime,
  createIncident
);
router.put(
  "/:id",
  authMiddleware,
  validateId,
  validateUpdateIncident,
  validatePriority,
  validateTime,
  updateIncident
);
router.patch("/:id/status", authMiddleware, validateId, validateStatus, updateIncidentStatus);

// Solo administrador (instructor-token)
router.delete("/:id", authMiddleware, adminMiddleware, validateId, deleteIncident);

export default router;
