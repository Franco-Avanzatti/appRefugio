// src/services/reservaService.ts
import { api } from "./api";
import { Reserva } from "../types";

export const reservaService = {
  getReservasByFecha: async (fecha: string): Promise<Reserva[]> => {
    const { data } = await api.get(`/reservas?fecha=${fecha}`);
    return data;
  },

  getMisReservas: async (): Promise<Reserva[]> => {
    const { data } = await api.get("/reservas/mis-reservas");
    return data;
  },

  crearReserva: async (
    cancha: string,
    fecha: string,
    inicio: string        // antes era horario
  ): Promise<Reserva> => {
    const { data } = await api.post("/reservas", { cancha, fecha, inicio });
    return data;
  },

  cancelarReserva: async (id: string): Promise<void> => {
    await api.delete(`/reservas/${id}`);
  },
};