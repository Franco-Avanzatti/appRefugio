const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchReservas(fecha?: string) {
  const url = fecha
    ? `${API_URL}/reservas?fecha=${fecha}`
    : `${API_URL}/reservas`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener reservas");
  return res.json();
}

export async function fetchUsuarios() {
  const res = await fetch(`${API_URL}/users`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}