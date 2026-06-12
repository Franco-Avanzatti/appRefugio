import { create } from "zustand";
import { Reserva } from "../types";

interface ReservaState {
  reservas: Reserva[];
  selectedFecha: string;
  setReservas: (reservas: Reserva[]) => void;
  setSelectedFecha: (fecha: string) => void;
  addReserva: (reserva: Reserva) => void;
  removeReserva: (id: string) => void;
}

export const useReservaStore = create<ReservaState>((set) => ({
  reservas: [],
  selectedFecha: new Date().toISOString().split("T")[0],

  setReservas: (reservas) => set({ reservas }),
  setSelectedFecha: (fecha) => set({ selectedFecha: fecha }),
  addReserva: (reserva) => set((state) => ({ reservas: [...state.reservas, reserva] })),
  removeReserva: (id) =>
    set((state) => ({ reservas: state.reservas.filter((r) => r._id !== id) })),
}));
