"use client";

const DAYS_ES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const DAYS_KEYS = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

function fmtHours(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export default function EmployeeDashboardClient({ user, schedule, stats, onShift, attendanceHistory }: {
  user: { name: string; email: string };
  schedule: any;
  stats: { todayMin: number; weekMin: number; monthMin: number };
  onShift: boolean;
  attendanceHistory: any[];
}) {
  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    LATE: { label: "Tardanza", color: "text-orange-400", bg: "bg-orange-500/10" },
    ON_TIME: { label: "A tiempo", color: "text-green-400", bg: "bg-green-500/10" },
    DAY_OFF: { label: "Día libre", color: "text-blue-400", bg: "bg-blue-500/10" },
    NO_SCHEDULE: { label: "—", color: "text-[var(--text-muted)]", bg: "bg-[var(--border)]" },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#E8B84B] rounded-xl flex items-center justify-center shrink-0">
            <span className="text-black font-black text-sm">{user.name.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm font-black text-[var(--text-primary)]">Hola, {user.name.split(" ")[0]} 👋</p>
            <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onShift && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              En turno
            </span>
          )}
          <a href="/api/auth/signout" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)] px-3 py-1.5 rounded-lg transition">
            Salir
          </a>
        </div>
      </div>

      <div className="p-6 space-y-5 max-w-2xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Hoy", value: fmtHours(stats.todayMin) },
            { label: "Esta semana", value: fmtHours(stats.weekMin) },
            { label: "Este mes", value: fmtHours(stats.monthMin) },
          ].map(s => (
            <div key={s.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 text-center">
              <p className="text-xs text-[var(--text-muted)] mb-1">{s.label}</p>
              <p className="text-xl font-black text-[#E8B84B]">{s.value || "0h"}</p>
            </div>
          ))}
        </div>

        {/* Schedule */}
        {schedule && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Mi horario</h3>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1.5">
                  {DAYS_KEYS.map((key, i) => (
                    <div key={key} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${schedule[key] ? "bg-[#E8B84B] text-black" : "bg-[var(--border)] text-[var(--text-muted)]"}`}>
                      {DAYS_ES[i].charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{schedule.startTime}</p>
                  <p className="text-xs text-[var(--text-muted)]">entrada</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{schedule.endTime}</p>
                  <p className="text-xs text-[var(--text-muted)]">salida</p>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <p className="text-xs text-[var(--text-muted)]">Tolerancia</p>
                  <p className="text-xs font-semibold text-[var(--text-primary)]">{schedule.toleranceMin}min</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance history */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--border)]">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Mi asistencia — últimos 7 días</h3>
          </div>
          {attendanceHistory.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">Sin registros esta semana</div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {attendanceHistory.map(entry => {
                const s = statusConfig[entry.status] || statusConfig.NO_SCHEDULE;
                const clockIn = new Date(entry.clockIn);
                const date = clockIn.toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" });
                const timeIn = clockIn.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
                const timeOut = entry.clockOut ? new Date(entry.clockOut).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }) : "—";
                return (
                  <div key={entry.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)] capitalize">{date}</p>
                      <p className="text-xs text-[var(--text-muted)]">{timeIn} — {timeOut}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        {entry.lateMin > 0 && <p className="text-xs text-orange-400">+{entry.lateMin}m tarde</p>}
                        {entry.overtimeMin > 0 && <p className="text-xs text-[#E8B84B]">+{entry.overtimeMin}m extra</p>}
                        {entry.durationMin > 0 && <p className="text-xs text-[var(--text-muted)]">{fmtHours(entry.durationMin)}</p>}
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${s.bg} ${s.color}`}>{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}