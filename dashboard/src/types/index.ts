export interface Usuario {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Cancha {
  _id: string;
  nombre: string;
  numero: number;
  techada: boolean;
}

export interface Reserva {
  _id: string;
  cancha: Cancha;
  numeroCancha: number;
  nombreCancha: string;
  techada: boolean;
  usuario: Usuario;
  fecha: string;
  inicio: string;
  bloque: string;
  estado: "confirmada" | "cancelada";
  createdAt: string;
}