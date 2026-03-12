"use client";
import { useLang } from "@/lib/LangContext";
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

const WEEKS = [
  { label: "Últimos 7 días", value: 7 },
  { label: "Últimos 14 días", value: 14 },
  { label: "Últimos 30 días", value: 30 },
];

export default function AttendancePage() {
  const { lang } = useLang();
  const t = lang === "es" ? { title: "Asistencia", search: "Buscar empleado...", export: "Exportar CSV", from: "Desde", to: "Hasta", days: "días", noData: "Sin registros", name: "Empleado", date: "Fecha", in: "Entrada", out: "Salida", hours: "Horas", status: "Estado", late: "Tarde", onTime: "A tiempo", absent: "Ausente" } : { title: "Attendance", search: "Search employee...", export: "Export CSV", from: "From", to: "To", days: "days", noData: "No records", name: "Employee", date: "Date", in: "Clock In", out: "Clock Out", hours: "Hours", status: "Status", late: "Late", onTime: "On time", absent: "Absent" };
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [days, setDays] = useState(7);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/attendance?days=${days}`)
      .then(r => r.json())
      .then(d => { 
        setEntries(d.entries || []); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, [days]);

  // CORRECCIÓN DE FILTRO: Sintaxis limpia y segura contra nulos
  const filtered = entries.filter(e => {
    const userName = (e.userName || "").toLowerCase();
    const searchTerm = (search || "").toLowerCase();
    const matchSearch = userName.includes(searchTerm);

    const matchFilter =
      filter === "all" ? true :
      filter === "late" ? e.status === "LATE" :
      filter === "ontime" ? e.status === "ON_TIME" :
      filter === "overtime" ? (e.overtimeMin || 0) > 0 :
      filter === "absence" ? e.status === "ABSENCE" : true;

    return matchSearch && matchFilter;
  });

  const lateCount = entries.filter(e => e.status === "LATE").length;
  const ontimeCount = entries.filter(e => e.status === "ON_TIME").length;
  const overtimeCount = entries.filter(e => (e.overtimeMin || 0) > 0).length;
  const totalOvertimeMin = entries.reduce((acc, e) => acc + (e.overtimeMin || 0), 0);
  const totalLateMin = entries.reduce((acc, e) => acc + (e.lateMin || 0), 0);

  function exportCSV() {
    const headers = ["Empleado","Fecha","Entrada","Salida","Estado","Tardanza (min)","Salida temprana (min)","Horas extra (min)","Duración (min)"];
    const rows = filtered.map(e => {
      const d = new Date(e.clockIn);
      return [
        e.userName || "Sin nombre",
        d.toLocaleDateString("es"),
        d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
        e.clockOut ? new Date(e.clockOut).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) : "",
        e.status === "LATE" ? "Tardanza" : e.status === "ON_TIME" ? "A tiempo" : e.status === "DAY_OFF" ? "Día libre" : "—",
        e.lateMin || 0,
        e.earlyMin || 0,
        e.overtimeMin || 0,
        e.durationMin || "",
      ].join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asistencia-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    LATE: { label: "Tardanza", color: "text-orange-400", bg: "bg-orange-500/10" },
    ON_TIME: { label: "A tiempo", color: "text-green-400", bg: "bg-green-500/10" },
    DAY_OFF: { label: "Día libre", color: "text-blue-400", bg: "bg-blue-500/10" },
    ABSENCE: { label: "Ausencia", color: "text-red-400", bg: "bg-red-500/10" },
    NO_SCHEDULE: { label: "Sin horario", color: "text-[var(--text-muted)]", bg: "bg-[var(--border)]" },
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center justify-between bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Asistencia</h1>
          <p className="text-xs text-[var(--text-muted)]">Tardanzas, horas extra y ausencias</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-1.5 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-lg text-xs font-semibold transition">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exportar CSV
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[var(--bg-card)] border border-green-500/20 rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">A tiempo</p>
            <p className="text-2xl font-black text-green-400">{ontimeCount}</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-orange-500/20 rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">Tardanzas</p>
            <p className="text-2xl font-black text-orange-400">{lateCount}</p>
            {totalLateMin > 0 && <p className="text-xs text-orange-400/60 mt-0.5">{totalLateMin} min total</p>}
          </div>
          <div className="bg-[var(--bg-card)] border border-[#E8B84B]/20 rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">Horas extra</p>
            <p className="text-2xl font-black text-[#E8B84B]">{overtimeCount}</p>
            {totalOvertimeMin > 0 && <p className="text-xs text-[#E8B84B]/60 mt-0.5">{Math.floor(totalOvertimeMin/60)}h {totalOvertimeMin%60}m total</p>}
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">Total registros</p>
            <p className="text-2xl font-black text-[var(--text-primary)]">{entries.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar empleado..."
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition w-44" />
          <div className="flex bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            {[["all","Todos"],["ontime","A tiempo"],["late","Tardanzas"],["overtime","Horas extra"],["absence","Ausencias"]].map(([key,label]) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-3 py-2 text-xs font-semibold transition ${filter === key ? "bg-[#E8B84B] text-black" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>
                {label}
              </button>
            ))}
          </div>
          <select value={days} onChange={e => setDays(Number(e.target.value))}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition">
            {WEEKS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Empleado</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">Horario</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Entrada</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Salida</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Estado</th>
                <th className="text-right px-5 py-2.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-[var(--text-muted)]">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-[var(--text-muted)]">Sin registros</td></tr>
              ) : filtered.map(entry => {
                const s = statusConfig[entry.status] || statusConfig.NO_SCHEDULE;
                const clockIn = new Date(entry.clockIn);
                const date = clockIn.toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" });
                const timeIn = clockIn.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
                const timeOut = entry.clockOut ? new Date(entry.clockOut).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) : "—";
                return (
                  <tr key={entry.id} className="hover:bg-[var(--border)]/20 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-[#E8B84B] text-xs font-black">{(entry.userName || "?").charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[var(--text-primary)]">{entry.userName || "Sin nombre"}</p>
                          <p className="text-xs text-[var(--text-muted)]">{date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <p className="text-xs text-[var(--text-muted)]">{entry.scheduledStart} — {entry.scheduledEnd}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{timeIn}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs text-[var(--text-muted)]">{timeOut}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${s.bg} ${s.color}`}>{s.label}</span>
                    </td>
                    <td className="px-5 py-3 text-right space-y-0.5">
                      {(entry.lateMin || 0) > 0 && <p className="text-xs text-orange-400">+{entry.lateMin}m tardanza</p>}
                      {(entry.earlyMin || 0) > 0 && <p className="text-xs text-blue-400">-{entry.earlyMin}m temprano</p>}
                      {(entry.overtimeMin || 0) > 0 && <p className="text-xs text-[#E8B84B]">+{entry.overtimeMin}m extra</p>}
                      {entry.lateMin === 0 && (entry.overtimeMin || 0) === 0 && entry.earlyMin === 0 && entry.status === "ON_TIME" && (
                        <p className="text-xs text-green-400">✓ Perfecto</p>
                      )}
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