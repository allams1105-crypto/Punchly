"use client";
import { useState, useEffect } from "react";

const COLORS = ["#E8B84B","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C"];

function Avatar({ name, color }: { name: string; color?: string | null }) {
  const bg = color || COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];
  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
      style={{ backgroundColor: bg + "20", border: `2px solid ${bg}40`, color: bg }}>
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

type Props = {
  user: { id: string; name: string; email: string; avatarColor?: string | null };
  onShift: boolean;
  todayEntry: { clockIn: string; clockOut?: string | null } | null;
  weekStats: { totalMin: number; daysWorked: number; lateCount: number };
  schedule: { startTime: string; endTime: string; monday: boolean; tuesday: boolean; wednesday: boolean; thursday: boolean; friday: boolean; saturday: boolean; sunday: boolean } | null;
  recentEntries: { id: string; clockIn: string; clockOut: string | null; durationMin: number | null }[];
  geoEnabled: boolean;
  geoRadius: number;
};

export default function EmployeeDashboardClient({ user, onShift: initialOnShift, todayEntry, weekStats, schedule, recentEntries, geoEnabled, geoRadius }: Props) {
  const [onShift, setOnShift] = useState(initialOnShift);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [locating, setLocating] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  const days = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const dayKeys = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"] as const;
  const todayIdx = new Date().getDay();

  async function clock() {
    setLoading(true);
    setError("");
    setSuccess("");

    const action = onShift ? "out" : "in";

    if (geoEnabled) {
      setLocating(true);
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
        );
        setLocating(false);
        const { latitude: lat, longitude: lng } = pos.coords;

        const res = await fetch("/api/clock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, lat, lng }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Error");
          if (data.distance) setDistance(data.distance);
          setLoading(false);
          return;
        }
        setOnShift(action === "in");
        setSuccess(action === "in" ? "Entrada registrada" : "Salida registrada");
      } catch (e: any) {
        setLocating(false);
        setError("No se pudo obtener tu ubicación. Activa el GPS.");
        setLoading(false);
        return;
      }
    } else {
      const res = await fetch("/api/clock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error"); setLoading(false); return; }
      setOnShift(action === "in");
      setSuccess(action === "in" ? "Entrada registrada" : "Salida registrada");
    }

    setLoading(false);
    setTimeout(() => setSuccess(""), 3000);
  }

  const totalH = Math.floor(weekStats.totalMin / 60);
  const totalM = weekStats.totalMin % 60;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <h1 className="text-sm font-black text-[var(--text-primary)]">Mi Panel</h1>
      </div>

      <div className="p-6 space-y-4 max-w-2xl mx-auto">
        {/* Profile + Clock */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={user.name} color={user.avatarColor} />
            <div>
              <p className="text-lg font-black text-[var(--text-primary)]">{user.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
              <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${onShift ? "bg-green-500/15 text-green-400 border border-green-500/25" : "bg-[var(--border)] text-[var(--text-muted)]"}`}>
                {onShift && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />}
                {onShift ? "En turno" : "Fuera de turno"}
              </div>
            </div>
          </div>

          {todayEntry && (
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-3 mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--text-muted)]">Hoy</p>
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  Entrada: {new Date(todayEntry.clockIn).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                  {todayEntry.clockOut && ` · Salida: ${new Date(todayEntry.clockOut).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}`}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
              {distance && <p className="text-red-400/70 text-xs mt-1">Distancia actual: {distance}m · Requerido: menos de {geoRadius}m</p>}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4">
              <p className="text-green-400 text-sm font-semibold">{success}</p>
            </div>
          )}

          <button onClick={clock} disabled={loading || locating}
            className={`w-full py-4 rounded-2xl font-black text-base transition disabled:opacity-50 ${onShift ? "bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25" : "bg-[#E8B84B] text-black hover:bg-[#d4a43a]"}`}>
            {locating ? "Obteniendo ubicación..." : loading ? "Registrando..." : onShift ? "Registrar Salida" : "Registrar Entrada"}
          </button>

          {geoEnabled && (
            <p className="text-xs text-[var(--text-muted)] text-center mt-2">
              Geofencing activo · debes estar a menos de {geoRadius}m de la empresa
            </p>
          )}
        </div>

        {/* Week stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-[#E8B84B]">{totalH}h {totalM}m</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Esta semana</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-[var(--text-primary)]">{weekStats.daysWorked}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Días trabajados</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 text-center">
            <p className={`text-2xl font-black ${weekStats.lateCount > 0 ? "text-red-400" : "text-green-400"}`}>{weekStats.lateCount}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Tardanzas</p>
          </div>
        </div>

        {/* Schedule */}
        {schedule && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider mb-3">Mi Horario</p>
            <div className="flex gap-2 mb-3">
              {days.map((d, i) => {
                const active = schedule[dayKeys[i]];
                const isToday = i === todayIdx;
                return (
                  <div key={d} className={`flex-1 py-2 rounded-xl text-center text-xs font-bold transition ${
                    isToday && active ? "bg-[#E8B84B] text-black" :
                    active ? "bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)]" :
                    "bg-[var(--bg-primary)] text-[var(--text-muted)] opacity-40"
                  }`}>{d}</div>
                );
              })}
            </div>
            <p className="text-xs text-[var(--text-muted)] text-center">{schedule.startTime} — {schedule.endTime}</p>
          </div>
        )}

        {/* Recent entries */}
        {recentEntries.length > 0 && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--border)]">
              <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider">Últimos registros</p>
            </div>
            {recentEntries.slice(0, 7).map(e => {
              const ci = new Date(e.clockIn);
              const h = Math.floor((e.durationMin || 0) / 60);
              const m = (e.durationMin || 0) % 60;
              return (
                <div key={e.id} className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{ci.toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" })}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {ci.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                      {e.clockOut && ` — ${new Date(e.clockOut).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}`}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{e.durationMin ? `${h}h ${m}m` : "—"}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}