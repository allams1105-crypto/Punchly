"use client";
import { useEffect, useState } from "react";

type DayData = { day: string; date: string; onTime: number; late: number; absent: number; total: number };

export default function AttendanceChart() {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/attendance/chart")
      .then(r => r.json())
      .then(d => { setData(d.days || []); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 h-48 flex items-center justify-center">
      <p className="text-xs text-[var(--text-muted)]">Cargando...</p>
    </div>
  );

  const max = Math.max(...data.map(d => d.onTime + d.late + d.absent), 1);

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Asistencia semanal</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Últimos 7 días</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-400 rounded-full"></span><span className="text-xs text-[var(--text-muted)]">A tiempo</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-orange-400 rounded-full"></span><span className="text-xs text-[var(--text-muted)]">Tardanza</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-400 rounded-full"></span><span className="text-xs text-[var(--text-muted)]">Ausencia</span></div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-end gap-2 h-32">
          {data.map((d, i) => {
            const onTimeH = (d.onTime / max) * 100;
            const lateH = (d.late / max) * 100;
            const absentH = (d.absent / max) * 100;
            const isToday = i === data.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: "100px" }}>
                  {d.absent > 0 && (
                    <div className="w-full bg-red-400/70 rounded-sm transition-all" style={{ height: `${absentH}%`, minHeight: d.absent > 0 ? "4px" : "0" }}></div>
                  )}
                  {d.late > 0 && (
                    <div className="w-full bg-orange-400/70 rounded-sm transition-all" style={{ height: `${lateH}%`, minHeight: d.late > 0 ? "4px" : "0" }}></div>
                  )}
                  {d.onTime > 0 && (
                    <div className="w-full bg-green-400/70 rounded-sm transition-all" style={{ height: `${onTimeH}%`, minHeight: d.onTime > 0 ? "4px" : "0" }}></div>
                  )}
                  {d.total === 0 && d.absent === 0 && (
                    <div className="w-full bg-[var(--border)] rounded-sm" style={{ height: "4px" }}></div>
                  )}
                </div>
                <p className={`text-xs font-semibold capitalize ${isToday ? "text-[#E8B84B]" : "text-[var(--text-muted)]"}`}>{d.day}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}