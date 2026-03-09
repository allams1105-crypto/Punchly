"use client";
import { useEffect, useState } from "react";

type Entry = {
  id: string;
  userId: string;
  userName: string;
  clockIn: string;
  clockOut: string | null;
  durationMin: number | null;
  status: string;
  lateMin: number;
  earlyMin: number;
  overtimeMin: number;
  scheduledStart: string;
  scheduledEnd: string;
};

export default function AttendancePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/attendance")
      .then(r => r.json())
      .then(d => { setEntries(d.entries || []); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? entries : entries.filter(e => {
    if (filter === "late") return e.status === "LATE";
    if (filter === "ontime") return e.status === "ON_TIME";
    if (filter === "overtime") return e.overtimeMin > 0;
    return true;
  });

  const lateCount = entries.filter(e => e.status === "LATE").length;
  const ontimeCount = entries.filter(e => e.status === "ON_TIME").length;
  const overtimeCount = entries.filter(e => e.overtimeMin > 0).length;

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    LATE: { label: "Tardanza", color: "text-orange-400", bg: "bg-orange-500/10" },
    ON_TIME: { label: "A tiempo", color: "text-green-400", bg: "bg-green-500/10" },
    DAY_OFF: { label: "Día libre", color: "text-blue-400", bg: "bg-blue-500/10" },
    NO_SCHEDULE: { label: "Sin horario", color: "text-[var(--text-muted)]", bg: "bg-[var(--border)]" },
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Asistencia</h1>
          <p className="text-xs text-[var(--text-muted)]">Tardanzas, horas extra y ausencias — últimos 7 días</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">A tiempo</p>
            <p className="text-2xl font-black text-green-400">{ontimeCount}</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-orange-500/20 rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">Tardanzas</p>
            <p className="text-2xl font-black text-orange-400">{lateCount}</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">Horas extra</p>
            <p className="text-2xl font-black text-[#E8B84B]">{overtimeCount}</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-1 w-fit">
          {[["all","Todos"],["late","Tardanzas"],["ontime","A tiempo"],["overtime","Horas extra"]].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === key ? "bg-[#E8B84B] text-black" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Empleado</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">Horario</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Entrada</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Estado</th>
                <th className="text-right px-5 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-[var(--text-muted)]">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-[var(--text-muted)]">Sin registros</td></tr>
              ) : filtered.map(entry => {
                const s = statusConfig[entry.status] || statusConfig.NO_SCHEDULE;
                const clockIn = new Date(entry.clockIn);
                const date = clockIn.toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" });
                const time = clockIn.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
                return (
                  <tr key={entry.id} className="hover:bg-[var(--border)]/20 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-[#E8B84B] text-xs font-black">{entry.userName.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[var(--text-primary)]">{entry.userName}</p>
                          <p className="text-xs text-[var(--text-muted)]">{date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <p className="text-xs text-[var(--text-muted)]">{entry.scheduledStart} — {entry.scheduledEnd}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{time}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${s.bg} ${s.color}`}>{s.label}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="space-y-0.5">
                        {entry.lateMin > 0 && <p className="text-xs text-orange-400">+{entry.lateMin}m tardanza</p>}
                        {entry.earlyMin > 0 && <p className="text-xs text-blue-400">-{entry.earlyMin}m salida temprana</p>}
                        {entry.overtimeMin > 0 && <p className="text-xs text-[#E8B84B]">+{entry.overtimeMin}m extra</p>}
                        {entry.lateMin === 0 && entry.overtimeMin === 0 && entry.earlyMin === 0 && entry.status === "ON_TIME" && (
                          <p className="text-xs text-green-400">✓ Perfecto</p>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}