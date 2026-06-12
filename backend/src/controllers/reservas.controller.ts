import { Request, Response, NextFunction } from "express";
import { ReservasService } from "../services/reservas.service";
import { io } from "../app";
import { IUser } from "../models/User";

export class ReservasController {
  static async getReservas(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const reservas = await ReservasService.getReservas(
        req.query.fecha as string
      );

      res.json(reservas);
    } catch (error) {
      next(error);
    }
  }

  static async getMisReservas(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user as IUser;

      const reservas = await ReservasService.getMisReservas(
        user._id.toString()
      );

      res.json(reservas);
    } catch (error) {
      next(error);
    }
  }

  static async crearReserva(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user as IUser;

      const reserva = await ReservasService.crearReserva({
        ...req.body,
        usuario: user._id,
      });

      io.emit("reserva:nueva", {
        cancha: reserva.cancha,
        fecha: reserva.fecha,
        horario: reserva.inicio,
      });

      res.status(201).json(reserva);
    } catch (error) {
      next(error);
    }
  }

  static async cancelarReserva(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user as IUser;

      const reserva = await ReservasService.cancelarReserva(
        req.params.id,
        user._id.toString()
      );

      io.emit("reserva:cancelada", {
        cancha: reserva.cancha,
        fecha: reserva.fecha,
        horario: reserva.inicio,
      });

      res.json({
        success: true,
        message: "Reserva cancelada",
      });
    } catch (error) {
      next(error);
    }
  }
}