"use client";

import { useState } from "react";

export default function KioskSetupPage() {
  const [name, setName] = useState("");
  const [exitPin, setExitPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [kioskUrl, setKioskUrl] = useState("");
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/kiosk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, exitPin }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al crear kiosk");
      setLoading(false);
      return;
    }

    setKioskUrl(`${window.location.origin}/en/kiosk/${data.token}`);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">Punchly</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 text-sm">Configurar Kiosk</span>
        </div>
        <a href="/en/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
          ← Volver
        </a>
      </div>
      <div className="max-w-lg mx-auto p-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Nuevo Kiosk</h1>
          <p className="text-gray-500 text-sm mb-6">
            Crea un kiosk para que tus empleados registren entrada y salida desde una tablet.
          </p>
          {!kioskUrl ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Kiosk
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Ej: Recepción, Entrada Principal"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN de salida
                </label>
                <input
                  type="password"
                  value={exitPin}
                  onChange={(e) => setExitPin(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="PIN para salir del kiosk"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Solo tú sabrás este PIN para salir del modo kiosk
                </p>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Creando..." : "Crear Kiosk"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-800 font-medium text-sm mb-1">
                  ✅ Kiosk creado exitosamente
                </p>
                <p className="text-green-600 text-xs">Abre esta URL en tu tablet</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">URL del Kiosk</p>
                <p className="text-sm font-mono text-gray-900 break-all">{kioskUrl}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(kioskUrl)}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Copiar URL
              </button>
              <a href={kioskUrl} target="_blank" className="block w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition text-center">
                Abrir Kiosk
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}