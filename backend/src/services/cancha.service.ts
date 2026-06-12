import { Cancha } from "../models/Cancha";
import { Reserva } from "../models/Reserva";
import { AppError } from "../utils/appError";
import { CreateCanchaDto } from "../schemas/cancha.schema";
import { HORARIOS } from "../constants/horarios";
import { addMinutes } from "../utils/time";

export class CanchaService {
  // =========================
  // CRUD CANCHAS
  // =========================

  static async getCanchas() {
    return Cancha.find().sort({ createdAt: -1 });
  }

  static async getCanchaById(id: string) {
    const cancha = await Cancha.findById(id);

    if (!cancha) {
      throw new AppError(404, "Cancha no encontrada");
    }

    return cancha;
  }

  static async createCancha(data: CreateCanchaDto) {
    return Cancha.create(data);
  }

  static async updateCancha(id: string, data: Partial<CreateCanchaDto>) {
    const cancha = await Cancha.findById(id);

    if (!cancha) {
      throw new AppError(404, "Cancha no encontrada");
    }

    Object.assign(cancha, data);
    await cancha.save();

    return cancha;
  }

  static async toggleEstado(id: string) {
    const cancha = await Cancha.findById(id);

    if (!cancha) {
      throw new AppError(404, "Cancha no encontrada");
    }

    cancha.activa = !cancha.activa;
    await cancha.save();

    return cancha;
  }

  static async deleteCancha(id: string) {
    const cancha = await Cancha.findById(id);

    if (!cancha) {
      throw new AppError(404, "Cancha no encontrada");
    }

    await cancha.deleteOne();

    return { message: "Cancha eliminada" };
  }

  // =========================
  // DISPONIBILIDAD (NUEVO)
  // =========================

  static async getDisponibilidad(canchaId: string, fecha: string) {
    const cancha = await Cancha.findById(canchaId);

    if (!cancha) {
      throw new AppError(404, "Cancha no encontrada");
    }

    if (!cancha.activa) {
      throw new AppError(400, "La cancha no está disponible");
    }

    const reservas = await Reserva.find({
      cancha: canchaId,
      fecha,
      estado: "confirmada",
    });

    const ocupados = new Set<string>();

    for (const r of reservas) {
      const inicio = r.get("horario") as string;
      const fin = addMinutes(inicio, 90);

      let actual = inicio;

      while (actual < fin) {
        ocupados.add(actual);
        actual = addMinutes(actual, 30);
      }
    }

    const disponibilidad = HORARIOS.map((hora) => ({
      hora,
      estado: ocupados.has(hora) ? "ocupado" : "libre",
    }));

    return {
      cancha: cancha.nombre,
      fecha,
      duracion: "1h30",
      apertura: ["08:00-13:00", "17:00-00:00"],
      horarios: disponibilidad,
    };
  }
}