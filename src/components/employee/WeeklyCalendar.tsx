"use client";

import { useState } from "react";

interface TimeEntry {
  id: string;
  clockIn: string;
  clockOut: string | null;
  durationMin: number | null;
  status: string;
}

interface Props {
  entries: TimeEntry[];
  weeklyMinutes: number;
  monthlyMinutes: number;
}

export default function WeeklyCalendar({ entries, weeklyMinutes, monthlyMinutes }: Props) {
  const [currentWeek, setCurrentWeek] = useState(0);

  const getWeekDays = (offset: number) => {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const days = getWeekDays(currentWeek);
  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const getEntriesForDay = (date: Date) => {
    return entries.filter((e) => {
      const entryDate = new Date(e.clockIn);
      return (
        entryDate.getDate() === date.getDate() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const formatHours = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const weekStart = days[0].toLocaleDateString("es", { day: "numeric", month: "short" });
  const weekEnd = days[6].toLocaleDateString("es", { day: "numeric", month: "short" });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">Esta semana</p>
          <p className="text-2xl font-bold text-gray-900">{formatHours(weeklyMinutes)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">Este mes</p>
          <p className="text-2xl font-bold text-gray-900">{formatHours(monthlyMinutes)}</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button
            onClick={() => setCurrentWeek(currentWeek - 1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            ←
          </button>
          <span className="text-sm font-semibold text-gray-900">
            {weekStart} — {weekEnd}
          </span>
          <button
            onClick={() => setCurrentWeek(currentWeek + 1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            disabled={currentWeek === 0}
          >
            →
          </button>
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 divide-x divide-gray-100">
          {days.map((day, i) => {
            const dayEntries = getEntriesForDay(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const totalMin = dayEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0);

            return (
              <div key={i} className="min-h-24 p-2">
                <div className={`text-center mb-2 ${isToday ? "font-bold" : ""}`}>
                  <p className="text-xs text-gray-400">{dayNames[i]}</p>
                  <p className={`text-sm font-semibold w-7 h-7 mx-auto flex items-center justify-center rounded-full ${isToday ? "bg-black text-white" : "text-gray-900"}`}>
                    {day.getDate()}
                  </p>
                </div>
                {dayEntries.length > 0 && (
                  <div className="space-y-1">
                    {dayEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`text-xs p-1 rounded text-center ${entry.status === "CLOCKED_IN" ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-700"}`}
                      >
                        {entry.durationMin ? `${Math.floor(entry.durationMin / 60)}h${entry.durationMin % 60}m` : "Activo"}
                      </div>
                    ))}
                    {totalMin > 0 && (
                      <p className="text-xs text-center text-gray-400 mt-1">
                        {Math.floor(totalMin / 60)}h
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent entries */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Historial reciente</h2>
        </div>
        {entries.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">No hay registros</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {entries.slice(0, 10).map((entry) => (
              <div key={entry.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(entry.clockIn).toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(entry.clockIn).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                    {entry.clockOut && ` → ${new Date(entry.clockOut).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}`}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${entry.status === "CLOCKED_IN" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {entry.durationMin ? `${Math.floor(entry.durationMin / 60)}h ${entry.durationMin % 60}m` : "Activo"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}