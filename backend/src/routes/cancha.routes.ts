import { Router } from "express";
import { CanchaController } from "../controllers/cancha.controller";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { createCanchaSchema } from "../schemas/cancha.schema";

const router = Router();

// públicas (ver canchas)
router.get("/", CanchaController.getCanchas);
router.get("/:id", CanchaController.getCanchaById);

// admin only (gestión)
router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  validate(createCanchaSchema),
  CanchaController.createCancha
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  CanchaController.updateCancha
);

router.patch(
  "/:id/toggle",
  authMiddleware,
  requireRole("admin"),
  CanchaController.toggleEstado
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  CanchaController.deleteCancha
);

export default router;