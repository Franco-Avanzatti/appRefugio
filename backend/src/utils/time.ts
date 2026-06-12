
const DURACION_MINUTOS = 90;

// Tu función existente — base de todo
export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  date.setMinutes(date.getMinutes() + minutes);
  let hh = date.getHours();
  const mm = date.getMinutes();
  if (hh === 24) hh = 0;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

// Calcula hora de fin dado un inicio
// "08:00" → "09:30"
export const calcularFin = (inicio: string): string => {
  return addMinutes(inicio, DURACION_MINUTOS);
};

// Genera el bloque lógico "08:00-09:30"
// Este es el valor que se guarda en Reserva.bloque
export const generarBloque = (inicio: string): string => {
  return `${inicio}-${calcularFin(inicio)}`;
};

// Convierte "08:30" a minutos totales para comparar
const horaAMinutos = (hora: string): number => {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
};

// Verifica si dos bloques se solapan
// "08:00-09:30" se solapa con "09:00-10:30"
export const seSolapan = (bloque1: string, bloque2: string): boolean => {
  const [ini1, fin1] = bloque1.split("-").map(horaAMinutos);
  const [ini2, fin2] = bloque2.split("-").map(horaAMinutos);
  return ini1 < fin2 && ini2 < fin1;
};

export const HORARIOS_MANANA = [
  "08:00", "08:30",
  "09:00", "09:30",
  "10:00", "10:30",
  "11:00", "11:30",
];

export const HORARIOS_TARDE = [
  "17:00", "17:30",
  "18:00", "18:30",
  "19:00", "19:30",
  "20:00", "20:30",
  "21:00", "21:30",
  "22:00", "22:30",
];

export const HORARIOS = [...HORARIOS_MANANA, ...HORARIOS_TARDE];