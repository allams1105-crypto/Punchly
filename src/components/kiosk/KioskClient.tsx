"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

interface Employee {
  id: string;
  name: string;
}

interface Props {
  token: string;
  organizationName: string;
  employees: Employee[];
  activeUserIds: string[];
  exitPin: string;
}

export default function KioskClient({
  token,
  organizationName,
  employees,
  activeUserIds,
  exitPin,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showExitPin, setShowExitPin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleClock(userId: string, isActive: boolean) {
    setLoading(userId);
    setMessage(null);

    const res = await fetch("/api/kiosk/clock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        userId,
        action: isActive ? "out" : "in",
      }),
    });

    if (res.ok) {
      setMessage({
        text: isActive ? "¡Salida registrada!" : "¡Entrada registrada!",
        type: "success",
      });
      setTimeout(() => {
        setMessage(null);
        router.refresh();
      }, 2000);
    } else {
      setMessage({ text: "Error al registrar", type: "error" });
    }

    setLoading(null);
  }

  async function handleExitPin() {
    const isValid = await bcrypt.compare(pinInput, exitPin);
    if (isValid) {
      router.push("/en/admin/dashboard");
    } else {
      setPinError("PIN incorrecto. Intenta de nuevo.");
      setPinInput("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold">Punchly</h1>
          <p className="text-gray-400 text-sm">{organizationName}</p>
        </div>
        <button
          onClick={() => setShowExitPin(true)}
          className="text-xs text-gray-600 hover:text-gray-400 transition"
        >
          Salir
        </button>
      </div>

      {/* Mensaje de confirmación */}
      {message && (
        <div
          className={`mx-8 mt-6 p-4 rounded-xl text-center font-medium ${
            message.type === "success"
              ? "bg-green-900 text-green-300"
              : "bg-red-900 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Búsqueda */}
      <div className="px-8 mt-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Busca tu nombre..."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-lg"
        />
      </div>

      {/* Lista empleados */}
      <div className="px-8 mt-4 flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((emp) => {
            const isActive = activeUserIds.includes(emp.id);
            return (
              <button
                key={emp.id}
                onClick={() => handleClock(emp.id, isActive)}
                disabled={loading === emp.id}
                className={`flex items-center justify-between p-5 rounded-xl border transition disabled:opacity-50 ${
                  isActive
                    ? "bg-green-950 border-green-700 hover:bg-green-900"
                    : "bg-gray-900 border-gray-700 hover:bg-gray-800"
                }`}
              >
                <span className="font-medium text-lg">{emp.name}</span>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    isActive
                      ? "bg-green-800 text-green-200"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {loading === emp.id
                    ? "..."
                    : isActive
                    ? "Clock Out"
                    : "Clock In"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal PIN salida */}
      {showExitPin && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-2">Salir del Kiosk</h2>
            <p className="text-gray-400 text-sm mb-6">Ingresa el PIN de administrador</p>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-white mb-3"
            />
            {pinError && <p className="text-red-400 text-sm mb-3">{pinError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowExitPin(false); setPinInput(""); setPinError(""); }}
                className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-400 hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleExitPin}
                className="flex-1 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}