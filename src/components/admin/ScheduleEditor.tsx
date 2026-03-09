"use client";
import { useState, useEffect } from "react";

const DAYS = [
  { key: "monday", label: "L" },
  { key: "tuesday", label: "M" },
  { key: "wednesday", label: "X" },
  { key: "thursday", label: "J" },
  { key: "friday", label: "V" },
  { key: "saturday", label: "S" },
  { key: "sunday", label: "D" },
];

export default function ScheduleEditor({ userId, employeeName }: { userId: string; employeeName: string }) {
  const [schedule, setSchedule] = useState({
    monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false,
    startTime: "08:00", endTime: "17:00", toleranceMin: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`/api/schedule?userId=${userId}`)
      .then(r => r.json())
      .then(d => {
        if (d.schedule) setSchedule(d.schedule);
        setLoading(false);
      });
  }, [userId]);

  function toggleDay(day: string) {
    setSchedule(prev => ({ ...prev, [day]: !(prev as any)[day] }));
  }

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...schedule }),
    });
    setMsg(res.ok ? "✓ Horario guardado" : "Error al guardar");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  }

  if (loading) return <div className="p-4 text-xs text-[var(--text-muted)]">Cargando...</div>;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Horario — {employeeName}</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Define días laborables y horario de entrada/salida</p>
        </div>
      </div>
      <div className="p-5 space-y-5">
        {/* Days */}
        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Días laborables</p>
          <div className="flex gap-2">
            {DAYS.map(d => (
              <button key={d.key} onClick={() => toggleDay(d.key)}
                className={`w-9 h-9 rounded-xl text-xs font-black transition ${(schedule as any)[d.key] ? "bg-[#E8B84B] text-black" : "bg-[var(--border)] text-[var(--text-muted)]"}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Hora entrada</label>
            <input type="time" value={schedule.startTime}
              onChange={e => setSchedule(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Hora salida</label>
            <input type="time" value={schedule.endTime}
              onChange={e => setSchedule(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B] transition" />
          </div>
        </div>

        {/* Tolerance */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Tolerancia de tardanza — {schedule.toleranceMin} minutos
          </label>
          <input type="range" min="0" max="30" step="5" value={schedule.toleranceMin}
            onChange={e => setSchedule(prev => ({ ...prev, toleranceMin: Number(e.target.value) }))}
            className="w-full accent-[#E8B84B]" />
          <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
            <span>0 min</span><span>15 min</span><span>30 min</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button onClick={save} disabled={saving}
            className="bg-[#E8B84B] text-black px-5 py-2.5 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition disabled:opacity-50">
            {saving ? "Guardando..." : "Guardar horario"}
          </button>
          {msg && <p className={`text-xs ${msg.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>{msg}</p>}
        </div>
      </div>
    </div>
  );
}