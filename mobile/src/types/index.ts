
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
}

export interface Cancha {
  _id: string;
  nombre: string;
  descripcion?: string;
  numero: number;
  activa: boolean;
  techada: boolean;
}

export interface Reserva {
  _id: string;
  cancha: Cancha;
  usuario: User;
  fecha: string;       // "2025-05-27"
  inicio: string;      // "11:00"
  bloque: string;      // clave anti solapamiento
  estado: "confirmada" | "cancelada";
  createdAt: string;
}

export interface HorarioSlot {
  hora: string;
  disponible: boolean;
  reservadaPorMi: boolean;
}