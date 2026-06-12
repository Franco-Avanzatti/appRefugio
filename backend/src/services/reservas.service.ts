import mongoose from "mongoose";
import { Reserva } from "../models/Reserva";
import { Cancha } from "../models/Cancha";
import { AppError } from "../utils/appError";
import { CreateReservaDto } from "../schemas/reserva.schema";
import { addMinutes } from "../utils/time";

export class ReservasService {
  static async getReservas(fecha?: string) {
    console.log("========== GET RESERVAS ==========");
    console.log("FECHA:", fecha);

    const filter: any = {
      estado: "confirmada",
    };

    if (fecha) {
      filter.fecha = fecha;
    }

    console.log("FILTER:", filter);

    const reservas = await Reserva.find(filter)
      .populate("cancha", "nombre numero techada")
      .populate("usuario", "name email role")
      .sort({ fecha: 1, inicio: 1 });

    console.log("RESERVAS ENCONTRADAS:", reservas.length);

    return reservas;
  }

  static async getMisReservas(userId: string) {
    console.log("========== MIS RESERVAS ==========");
    console.log("USER ID:", userId);

    const reservas = await Reserva.find({
      usuario: userId,
      estado: "confirmada",
    })
      .populate("cancha", "nombre numero techada")
      .populate("usuario", "name email role")
      .sort({ fecha: 1, inicio: 1 });

    console.log("MIS RESERVAS:", reservas.length);

    return reservas;
  }

  static async crearReserva(
    data: CreateReservaDto & {
      usuario: mongoose.Types.ObjectId;
    }
  ) {
    console.log("=================================");
    console.log("CREANDO RESERVA");
    console.log("DATA:", data);
    console.log("CANCHA:", data.cancha);
    console.log("FECHA:", data.fecha);
    console.log("INICIO:", data.inicio);
    console.log("USUARIO:", data.usuario);
    console.log("=================================");

    // 1. VALIDAR CANCHA
    console.log("BUSCANDO CANCHA...");

    const cancha = await Cancha.findById(data.cancha);

    console.log("CANCHA ENCONTRADA:");
    console.log(cancha);

    if (!cancha) {
      console.log("ERROR: CANCHA NO EXISTE");

      throw new AppError(404, "La cancha no existe");
    }

    if (!cancha.activa) {
      console.log("ERROR: CANCHA INACTIVA");

      throw new AppError(400, "La cancha no está activa");
    }

    console.log("CANCHA VÁLIDA");
    console.log("NOMBRE:", cancha.nombre);
    console.log("NÚMERO:", cancha.numero);
    console.log("TECHADA:", cancha.techada);

    // 2. VALIDAR HORARIO
    const inicio = data.inicio;

    console.log("VALIDANDO HORARIO:", inicio);

    const esValido =
      (inicio >= "08:00" && inicio < "13:00") ||
      (inicio >= "17:00" && inicio <= "23:30");

    console.log("ES VÁLIDO:", esValido);

    if (!esValido) {
      throw new AppError(
        400,
        "Horario fuera del rango permitido"
      );
    }

    // 3. CALCULAR FIN Y BLOQUE
    const fin = addMinutes(inicio, 90);
    const bloque = `${inicio}-${fin}`;

    console.log("FIN:", fin);
    console.log("BLOQUE:", bloque);

    // 4. BUSCAR RESERVAS EXISTENTES
    console.log("BUSCANDO RESERVAS EXISTENTES...");

    const reservas = await Reserva.find({
      cancha: data.cancha,
      fecha: data.fecha,
      estado: "confirmada",
    });

    console.log("RESERVAS ENCONTRADAS:", reservas.length);

    // 5. VALIDAR SOLAPAMIENTO
    for (const r of reservas) {
      const rInicio = r.inicio;
      const rFin = addMinutes(rInicio, 90);

      console.log("--------------------------------");
      console.log(
        `Comparando nueva reserva ${inicio}-${fin}`
      );
      console.log(
        `Contra reserva existente ${rInicio}-${rFin}`
      );

      const solapa = inicio < rFin && fin > rInicio;

      console.log("SOLAPA:", solapa);

      if (solapa) {
        console.log("SOLAPAMIENTO DETECTADO");

        throw new AppError(
          400,
          "Ya existe una reserva en ese horario"
        );
      }
    }

    console.log("NO HAY SOLAPAMIENTOS");

    const reservaData = {
      ...data,

      inicio,
      bloque,

      numeroCancha: cancha.numero,
      nombreCancha: cancha.nombre,
      techada: cancha.techada,
    };

    console.log("=================================");
    console.log("OBJETO FINAL A GUARDAR");
    console.log(
      JSON.stringify(reservaData, null, 2)
    );
    console.log("=================================");

    const reserva = await Reserva.create(reservaData);

    console.log("=================================");
    console.log("RESERVA CREADA");
    console.log(reserva);
    console.log("=================================");

    return reserva;
  }

  static async cancelarReserva(
    reservaId: string,
    userId: string
  ) {
    console.log("========== CANCELAR RESERVA ==========");
    console.log("RESERVA ID:", reservaId);
    console.log("USER ID:", userId);

    if (!mongoose.Types.ObjectId.isValid(reservaId)) {
      throw new AppError(400, "ID de reserva inválido");
    }

    const reserva = await Reserva.findOne({
      _id: reservaId,
      usuario: userId,
      estado: "confirmada",
    });

    console.log("RESERVA ENCONTRADA:");
    console.log(reserva);

    if (!reserva) {
      throw new AppError(404, "Reserva no encontrada");
    }

    reserva.estado = "cancelada";

    await reserva.save();

    console.log("RESERVA CANCELADA");

    return reserva;
  }
}