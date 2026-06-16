import { Reserva } from "@/types";

export default function ReservaCard({ reserva }: { reserva: Reserva }) {
  return (
    <div className="bg-gray-900 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-800">
      
      {/* Cancha */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center text-green-400 font-bold text-lg">
          {reserva.numeroCancha}
        </div>
        <div>
          <p className="text-white font-semibold">{reserva.nombreCancha}</p>
          <p className="text-gray-400 text-sm">
            {reserva.techada ? "🏠 Techada" : "☀️ Al aire libre"}
          </p>
        </div>
      </div>

      {/* Fecha y horario */}
      <div className="text-center">
        <p className="text-white font-medium">{reserva.fecha}</p>
        <p className="text-gray-400 text-sm">{reserva.bloque}</p>
      </div>

      {/* Usuario */}
      <div className="text-right">
        <p className="text-white font-medium">{reserva.usuario.name}</p>
        <p className="text-gray-400 text-sm">{reserva.usuario.email}</p>
      </div>

      {/* Estado */}
      <div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-600/20 text-green-400">
          {reserva.estado}
        </span>
      </div>

    </div>
  );
}