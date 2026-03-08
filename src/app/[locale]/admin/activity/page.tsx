"use client";
import { useEffect, useState } from "react";

export default function ActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity")
      .then(r => r.json())
      .then(d => { setLogs(d.logs || []); setLoading(false); });
  }, []);

  const actionLabel: Record<string, { label: string; color: string; bg: string }> = {
    CLOCK_IN: { label: "Entrada", color: "text-green-400", bg: "bg-green-500/10" },
    CLOCK_OUT: { label: "Salida", color: "text-blue-400", bg: "bg-blue-500/10" },
    EMPLOYEE_CREATED: { label: "Creado", color: "text-[#E8B84B]", bg: "bg-[#E8B84B]/10" },
    EMPLOYEE_UPDATED: { label: "Editado", color: "text-purple-400", bg: "bg-purple-500/10" },
    EMPLOYEE_DEACTIVATED: { label: "Desactivado", color: "text-red-400", bg: "bg-red-500/10" },
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Actividad</h1>
          <p className="text-xs text-[var(--text-muted)]">Registro de eventos del sistema</p>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">Cargando...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">Sin actividad registrada</div>
          ) : logs.map((log: any) => {
            const action = actionLabel[log.action] || { label: log.action, color: "text-[var(--text-muted)]", bg: "bg-[var(--border)]" };
            const date = new Date(log.createdAt);
            return (
              <div key={log.id} className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)]/30 transition">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${action.bg} ${action.color}`}>
                    {action.label}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{log.userName}</p>
                    {log.details && <p className="text-xs text-[var(--text-muted)]">{log.details}</p>}
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] shrink-0 ml-4">
                  {date.toLocaleDateString("es", { day: "numeric", month: "short" })} · {date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}