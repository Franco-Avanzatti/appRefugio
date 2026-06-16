import { fetchUsuarios } from "@/lib/api";
import { Usuario } from "@/types";
import dayjs from "dayjs";

export default async function UsuariosPage() {
  const usuarios: Usuario[] = await fetchUsuarios();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Usuarios</h1>
        <span className="text-gray-400 text-sm">{usuarios.length} usuarios registrados</span>
      </div>

      <div className="bg-gray-900 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Usuario</th>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Email</th>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Rol</th>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Registrado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {usuario.avatar ? (
                      <img src={usuario.avatar} alt={usuario.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                        {usuario.name[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-white text-sm">{usuario.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">{usuario.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    usuario.role === "admin"
                      ? "bg-green-600/20 text-green-400"
                      : "bg-gray-700 text-gray-300"
                  }`}>
                    {usuario.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {dayjs(usuario.createdAt).format("DD/MM/YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}