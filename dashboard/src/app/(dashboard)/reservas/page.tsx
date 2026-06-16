import { fetchReservas } from "@/lib/api";
import { Reserva } from "@/types";
import ReservaCard from "@/components/dashboard/ReservaCard";

interface Props {
  searchParams: Promise<{ fecha?: string }>;
}

export default async function ReservasPage({ searchParams }: Props) {
  const { fecha } = await searchParams;
  let reservas: Reserva[] = [];

  try {
    reservas = await fetchReservas(fecha);
  } catch (error) {
    console.error(error);
  }

  const hoy = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reservas</h1>
          <p className="text-gray-400 text-sm mt-1">
            {reservas.length} reservas confirmadas
            {fecha ? ` para el ${fecha}` : " en total"}
          </p>
        </div>
        <form method="GET">
          <div className="flex items-center gap-2">
            <input
              type="date"
              name="fecha"
              defaultValue={fecha || hoy}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Filtrar
            </button>
            {fecha && (
              <a
                href="/reservas"
                className="text-gray-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Ver todas
              </a>
            )}
          </div>
        </form>
      </div>

  {
    reservas.length === 0 ? (
      <div className="text-center py-20 text-gray-500">
        No hay reservas confirmadas
      </div>
    ) : (
      <div className="grid gap-4">
        {reservas.map((reserva) => (
          <ReservaCard key={reserva._id} reserva={reserva} />
        ))}
      </div>
    )
  }
    </div >
  );
}