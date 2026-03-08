"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Log { id: string; userName: string; action: string; details: string | null; createdAt: string; }

const ACTION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  CLOCK_IN:         { bg: "bg-green-500/15",   text: "text-green-400",   label: "Entrada"   },
  CLOCK_OUT:        { bg: "bg-blue-500/15",    text: "text-blue-400",    label: "Salida"    },
  EMPLOYEE_CREATED: { bg: "bg-[#E8B84B]/15",   text: "text-[#E8B84B]",  label: "Nuevo"     },
  EMPLOYEE_UPDATED: { bg: "bg-orange-500/15",  text: "text-orange-400",  label: "Editado"   },
  EMPLOYEE_DELETED: { bg: "bg-red-500/15",     text: "text-red-400",     label: "Eliminado" },
  SETTINGS_UPDATED: { bg: "bg-white/10",       text: "text-white/50",    label: "Settings"  },
};

export default function ActivityPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity").then((r) => r.json()).then((data) => {
      setLogs(Array.isArray(data) ? data : []); setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-black border-b border-white/8 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#E8B84B] rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xs">P</span>
          </div>
          <span className="text-white font-black text-lg">Punchly.Clock</span>
          <span className="text-white/20 mx-1">|</span>
          <span className="text-white/40 text-sm">Actividad</span>
        </div>
        <Link href="/en/admin/dashboard" className="text-xs text-white/40 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition">← Volver</Link>
      </div>
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/8">
            <h2 className="text-sm font-bold text-white">Log de actividad</h2>
            <p className="text-xs text-white/30 mt-0.5">Ultimas 100 acciones</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-white/30">Cargando...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-sm text-white/30">No hay actividad todavia</div>
          ) : (
            <div className="divide-y divide-white/5">
              {logs.map((log) => {
                const style = ACTION_STYLES[log.action] || { bg: "bg-white/8", text: "text-white/40", label: log.action };
                const date = new Date(log.createdAt);
                return (
                  <div key={log.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${style.bg} ${style.text}`}>{style.label}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{log.userName}</p>
                        {log.details && <p className="text-xs text-white/30 mt-0.5">{log.details}</p>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-white/30">{date.toLocaleDateString("es", { day: "numeric", month: "short" })}</p>
                      <p className="text-xs text-white/20">{date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</p>
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