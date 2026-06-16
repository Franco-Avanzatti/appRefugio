"use client";

import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <h2 className="text-white font-semibold text-lg">Dashboard</h2>
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-sm">{session?.user?.email}</span>
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
          A
        </div>
      </div>
    </header>
  );
}