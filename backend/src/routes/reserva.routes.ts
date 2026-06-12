import { Router } from "express";
import { ReservasController } from "../controllers/reservas.controller";
import {
  authMiddleware,
  requireRole,
} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { createReservaSchema } from "../schemas/reserva.schema";

const router = Router();

router.get(
  "/",
  ReservasController.getReservas
);

router.get(
  "/mis-reservas",
  authMiddleware,
  requireRole("user", "admin"),
  ReservasController.getMisReservas
);

router.post(
  "/",
  authMiddleware,
  requireRole("user", "admin"),
  validate(createReservaSchema),
  ReservasController.crearReserva
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("user", "admin"),
  ReservasController.cancelarReserva
);

export default router;