"use client";
import { useState, useEffect } from "react";

const COLORS = ["#E8B84B","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80"];

function Avatar({ name, color, size = "md" }: { name: string; color?: string | null; size?: "sm" | "md" | "lg" }) {
  const bg = color || COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];
  const sz = size === "lg" ? "w-20 h-20 text-3xl" : size === "md" ? "w-14 h-14 text-xl" : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-2xl flex items-center justify-center font-black shrink-0`}
      style={{ backgroundColor: bg + "25", border: `2px solid ${bg}50`, color: bg }}>
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

type Employee = {
  id: string;
  name: string;
  avatarColor?: string | null;
  onShift: boolean;
  clockInTime?: string | null;
};

type Step = "list" | "pin" | "success";

export default function KioskClient({ employees, token }: { employees: Employee[]; token: string }) {
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [step, setStep] = useState<Step>("list");
  const [pin, setPin] = useState("");
  const [action, setAction] = useState<"in"|"out">("in");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const filtered = employees.filter(e =>
    (e.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const onShiftNow = employees.filter(e => e.onShift);

  function selectEmployee(emp: Employee) {
    setSelected(emp);
    setAction(emp.onShift ? "out" : "in");
    setPin("");
    setError("");
    setStep("pin");
  }

  function addDigit(d: string) {
    if (pin.length < 4) setPin(prev => prev + d);
  }

  function removeDigit() {
    setPin(prev => prev.slice(0, -1));
  }

  async function confirmPin() {
    if (pin.length !== 4) { setError("Ingresa tu PIN de 4 dígitos"); return; }
    setLoading(true);
    setError("");
    const res = await fetch(`/api/kiosk/clock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selected!.id, organizationId: token, action, pin }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Error al registrar"); return; }
    setSuccessMsg(action === "in" ? "Entrada registrada" : "Salida registrada");
    setStep("success");
    setTimeout(() => {
      setStep("list");
      setSelected(null);
      setPin("");
      setSearch("");
      setSuccessMsg("");
    }, 3000);
  }

  const timeStr = time.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = time.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });

  // SUCCESS SCREEN
  if (step === "success") return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="text-center animate-pulse">
        <div className="w-24 h-24 bg-[#E8B84B]/20 border-2 border-[#E8B84B] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <p className="text-4xl font-black text-white mb-2">{successMsg}</p>
        <p className="text-xl text-[#E8B84B] font-bold">{selected?.name}</p>
        <p className="text-white/40 mt-2">{timeStr}</p>
      </div>
    </div>
  );

  // PIN SCREEN
  if (step === "pin") return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <button onClick={() => setStep("list")} className="absolute top-6 left-6 text-white/40 hover:text-white transition text-sm flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        Volver
      </button>

      <div className="w-full max-w-sm">
        {/* Employee info */}
        <div className="flex flex-col items-center mb-8">
          <Avatar name={selected!.name} color={selected?.avatarColor} size="lg" />
          <p className="text-2xl font-black text-white mt-4">{selected!.name}</p>
          <div className={`mt-2 px-4 py-1.5 rounded-full text-sm font-bold ${action === "in" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
            {action === "in" ? "Registrar Entrada" : "Registrar Salida"}
          </div>
        </div>

        {/* PIN dots */}
        <div className="flex justify-center gap-4 mb-8">
          {[0,1,2,3].map(i => (
            <div key={i} className={`w-5 h-5 rounded-full transition-all ${i < pin.length ? "bg-[#E8B84B] scale-110" : "bg-white/20"}`} />
          ))}
        </div>

        {error && <p className="text-center text-red-400 text-sm mb-4">{error}</p>}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3">
          {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d, i) => (
            <button key={i} onClick={() => d === "⌫" ? removeDigit() : d ? addDigit(d) : null}
              disabled={!d && d !== "0"}
              className={`h-16 rounded-2xl text-xl font-black transition ${
                d === "⌫" ? "bg-white/10 text-white/60 hover:bg-white/20" :
                d ? "bg-white/10 text-white hover:bg-white/20 active:bg-[#E8B84B]/30 active:text-[#E8B84B]" :
                "opacity-0 pointer-events-none"
              }`}>
              {d}
            </button>
          ))}
        </div>

        <button onClick={confirmPin} disabled={loading || pin.length !== 4}
          className="w-full mt-4 bg-[#E8B84B] text-black py-4 rounded-2xl font-black text-lg hover:bg-[#d4a43a] transition disabled:opacity-40">
          {loading ? "Verificando..." : "Confirmar"}
        </button>
      </div>
    </div>
  );

  // MAIN LIST SCREEN
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex items-start justify-between">
        <div>
          <p className="text-5xl font-black text-white tracking-tight">{timeStr}</p>
          <p className="text-white/40 text-sm mt-1 capitalize">{dateStr}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#E8B84B] rounded-xl flex items-center justify-center">
            <span className="text-black font-black text-sm">P</span>
          </div>
          <span className="text-white font-black">Punchly.Clock</span>
        </div>
      </div>

      {/* On shift strip */}
      {onShiftNow.length > 0 && (
        <div className="px-8 py-3 border-y border-white/8 flex items-center gap-3 overflow-x-auto">
          <span className="text-xs text-white/40 shrink-0">En turno:</span>
          {onShiftNow.map(e => (
            <div key={e.id} className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-green-400 font-semibold">{e.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="px-8 py-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Busca tu nombre..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-lg placeholder-white/20 focus:outline-none focus:border-[#E8B84B]/50 transition" />
      </div>

      {/* Employee grid */}
      <div className="flex-1 px-8 pb-8 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(emp => (
            <button key={emp.id} onClick={() => selectEmployee(emp)}
              className={`p-5 rounded-2xl border text-left transition active:scale-95 ${
                emp.onShift
                  ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#E8B84B]/30"
              }`}>
              <Avatar name={emp.name} color={emp.avatarColor} size="md" />
              <p className="text-sm font-black text-white mt-3 leading-tight">{emp.name}</p>
              {emp.onShift ? (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-xs text-green-400">En turno</span>
                </div>
              ) : (
                <span className="text-xs text-white/30 mt-1.5 block">Fuera</span>
              )}
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm">No se encontraron empleados</p>
          </div>
        )}
      </div>
    </div>
  );
}