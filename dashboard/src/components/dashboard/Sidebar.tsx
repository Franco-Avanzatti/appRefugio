"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/reservas", label: "Reservas", icon: "🎾" },
  { href: "/usuarios", label: "Usuarios", icon: "👤" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-white font-bold text-xl">El Refugio</h1>
        <p className="text-gray-400 text-sm">Panel Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${pathname === link.href
                ? "bg-green-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: "http://localhost:3000/login" })}
          className="w-full text-left px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition text-sm"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  );
}