const isProduction = !__DEV__;

export const API_URL = isProduction
  ? "https://apprefugio.onrender.com/api"
  : "http://localhost:3000/api";

export const HORARIOS_RESERVA = [
  "08:00",
  "09:30",
  "11:00",
  "12:30",
  "17:00",
  "18:30",
  "20:00",
  "21:30",
  "23:00",
];

export const DURACION_TURNO = "1h 30min";