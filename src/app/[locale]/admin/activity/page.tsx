"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Log {
  id: string;
  userName: string;
  action: string;
  details: string | null;
  createdAt: string;
}

const ACTION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  CLOCK_IN:           { bg: "bg-green-100",  text: "text-green-700",  label: "Entrada"    },
  CLOCK_OUT:          { bg: "bg-blue-100",   text: "text-blue-700",   label: "Salida"     },
  EMPLOYEE_CREATED:   { bg: "bg-violet-100", text: "text-violet-700", label: "Nuevo"      },
  EMPLOYEE_UPDATED:   { bg: "bg-yellow-100", text: "text-yellow-700", label: "Editado"    },
  EMPLOYEE_DELETED:   { bg: "bg-red-100",    text: "text-red-700",    label: "Eliminado"  },
  SETTINGS_UPDATED:   { bg: "bg-gray-100",   text: "text-gray-700",   label: "Settings"   },
};

export default function ActivityPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.json())
      .then((data) => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">Punchly</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 text-sm">Actividad</span>
        </div>
        <Link href="/en/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Volver</Link>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Log de actividad</h2>
            <p className="text-xs text-gray-400 mt-0.5">Ultimas 100 acciones</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-400">Cargando...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">No hay actividad todavia</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {logs.map((log) => {
                const style = ACTION_STYLES[log.action] || { bg: "bg-gray-100", text: "text-gray-700", label: log.action };
                const date = new Date(log.createdAt);
                return (
                  <div key={log.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{log.userName}</p>
                        {log.details && <p className="text-xs text-gray-400">{log.details}</p>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">{date.toLocaleDateString("es", { day: "numeric", month: "short" })}</p>
                      <p className="text-xs text-gray-300">{date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</p>
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