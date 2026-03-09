"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

interface Employee { id: string; name: string; }
interface Props {
  token: string;
  organizationName: string;
  employees: Employee[];
  activeUserIds: string[];
  exitPin: string;
}

export default function KioskClient({ token, organizationName, employees, activeUserIds, exitPin }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error"; name: string } | null>(null);
  const [showExitPin, setShowExitPin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [activeIds, setActiveIds] = useState<string[]>(activeUserIds);

  const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  const now = new Date();
  const timeStr = now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });

  async function handleClock(userId: string, empName: string, isActive: boolean) {
    setLoading(userId);
    setMessage(null);
    const res = await fetch("/api/kiosk/clock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, userId, action: isActive ? "out" : "in" }),
    });
    if (res.ok) {
      setMessage({ text: isActive ? "Salida registrada" : "Entrada registrada", type: "success", name: empName });
      if (isActive) {
        setActiveIds(prev => prev.filter(id => id !== userId));
      } else {
        setActiveIds(prev => [...prev, userId]);
      }
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ text: "Error al registrar", type: "error", name: empName });
    }
    setLoading(null);
  }

  async function handleExitPin() {
    const isValid = await bcrypt.compare(pinInput, exitPin);
    if (isValid) {
      router.push("/en/admin/dashboard");
    } else {
      setPinError("PIN incorrecto");
      setPinInput("");
    }
  }

  const activeCount = activeIds.length;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#E8B84B] rounded-xl flex items-center justify-center">
            <span className="text-black font-black text-base">P</span>
          </div>
          <div>
            <p className="text-white font-black text-sm leading-none">Punchly.Clock</p>
            <p className="text-white/40 text-xs mt-0.5">{organizationName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-white font-black text-lg leading-none">{timeStr}</p>
            <p className="text-white/40 text-xs capitalize mt-0.5">{dateStr}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-green-400">{activeCount} en turno</span>
          </div>
          <button onClick={() => setShowExitPin(true)}
            className="text-xs text-white/30 hover:text-white/60 transition border border-white/10 px-3 py-1.5 rounded-lg">
            Salir
          </button>
        </div>
      </div>

      {/* Toast message */}
      {message && (
        <div className={`mx-6 mt-4 p-4 rounded-2xl flex items-center gap-3 ${message.type === "success" ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${message.type === "success" ? "bg-green-500/20" : "bg-red-500/20"}`}>
            {message.type === "success"
              ? <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            }
          </div>
          <div>
            <p className={`text-sm font-bold ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>{message.text}</p>
            <p className="text-xs text-white/40">{message.name}</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-6 mt-5">
        <div className="relative">
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Busca tu nombre..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#E8B84B]/50 text-base transition" />
        </div>
      </div>

      {/* Employee grid */}
      <div className="px-6 mt-4 flex-1 overflow-auto pb-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm">No se encontró ningún empleado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((emp) => {
              const isActive = activeIds.includes(emp.id);
              const isLoading = loading === emp.id;
              return (
                <button key={emp.id} onClick={() => handleClock(emp.id, emp.name, isActive)} disabled={isLoading}
                  className={`relative flex items-center justify-between p-5 rounded-2xl border transition-all disabled:opacity-60 text-left ${
                    isActive
                      ? "bg-[#E8B84B]/10 border-[#E8B84B]/30 hover:bg-[#E8B84B]/15"
                      : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-[#E8B84B]/20" : "bg-white/8"}`}>
                      <span className={`text-base font-black ${isActive ? "text-[#E8B84B]" : "text-white/50"}`}>
                        {emp.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{emp.name}</p>
                      <p className={`text-xs mt-0.5 ${isActive ? "text-[#E8B84B]/60" : "text-white/30"}`}>
                        {isActive ? "Trabajando" : "Fuera"}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                    isLoading
                      ? "bg-white/10 text-white/40"
                      : isActive
                      ? "bg-red-500/20 text-red-400 border border-red-500/20"
                      : "bg-[#E8B84B] text-black"
                  }`}>
                    {isLoading ? "..." : isActive ? "Clock Out" : "Clock In"}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Exit PIN modal */}
      {showExitPin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 w-full max-w-sm">
            <div className="w-12 h-12 bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-2xl flex items-center justify-center mb-5 mx-auto">
              <svg className="w-6 h-6 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h2 className="text-lg font-black text-white text-center mb-1">PIN de administrador</h2>
            <p className="text-white/40 text-xs text-center mb-6">Ingresa el PIN para salir del kiosk</p>
            <input type="password" value={pinInput} onChange={e => setPinInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleExitPin()}
              placeholder="••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-[#E8B84B]/50 mb-3 transition" />
            {pinError && <p className="text-red-400 text-xs text-center mb-3">{pinError}</p>}
            <div className="flex gap-3">
              <button onClick={() => { setShowExitPin(false); setPinInput(""); setPinError(""); }}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white transition text-sm font-medium">
                Cancelar
              </button>
              <button onClick={handleExitPin}
                className="flex-1 py-3 rounded-xl bg-[#E8B84B] text-black font-black hover:bg-[#d4a43a] transition text-sm">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}