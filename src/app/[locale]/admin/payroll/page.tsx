"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

interface EmpPayroll {
  id: string; name: string; role: string; hourlyRate: number | null;
  overtimeRate: number | null; totalHours: number; regularHours: number;
  overtimeHours: number; totalPay: number;
}

export default function PayrollPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [half, setHalf] = useState(now.getDate() <= 15 ? "1" : "2");
  const [data, setData] = useState<EmpPayroll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/payroll?year=${year}&month=${month}&half=${half}`)
      .then((r) => r.json())
      .then((res) => { setData(res.data || []); setLoading(false); });
  }, [year, month, half]);

  const totalPayroll = data.reduce((acc, e) => acc + e.totalPay, 0);
  const periodLabel = half === "1" ? `1 — 15 ${MONTHS[month - 1]} ${year}` : `16 — ${new Date(year, month, 0).getDate()} ${MONTHS[month - 1]} ${year}`;

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-black border-b border-white/8 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#E8B84B] rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xs">P</span>
          </div>
          <span className="text-white font-black text-lg">Punchly.Clock</span>
          <span className="text-white/20 mx-1">|</span>
          <span className="text-white/40 text-sm">Historial de Nomina</span>
        </div>
        <Link href="/en/admin/dashboard" className="text-xs text-white/40 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition">← Volver</Link>
      </div>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Ano</label>
              <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8B84B]">
                {[2024,2025,2026,2027].map((y) => <option key={y} value={y} className="bg-black">{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Mes</label>
              <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8B84B]">
                {MONTHS.map((m, i) => <option key={i} value={i+1} className="bg-black">{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Quincena</label>
              <select value={half} onChange={(e) => setHalf(e.target.value)} className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E8B84B]">
                <option value="1" className="bg-black">Primera (1-15)</option>
                <option value="2" className="bg-black">Segunda (16-fin)</option>
              </select>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-white/30">Periodo</p>
              <p className="text-sm font-bold text-white">{periodLabel}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-2xl p-6">
          <p className="text-xs text-[#E8B84B]/60 uppercase tracking-wider mb-1">Total nomina</p>
          <p className="text-5xl font-black text-[#E8B84B]">${totalPayroll.toLocaleString()}</p>
          <p className="text-xs text-[#E8B84B]/40 mt-2">{data.length} empleados · {periodLabel}</p>
        </div>
        <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/8">
            <h2 className="text-sm font-bold text-white">Desglose por empleado</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-white/30">Cargando...</div>
          ) : data.length === 0 ? (
            <div className="p-8 text-center text-sm text-white/30">No hay registros para este periodo</div>
          ) : (
            <div className="divide-y divide-white/5">
              {data.map((emp) => (
                <div key={emp.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{emp.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${emp.role === "ADMIN" ? "bg-[#E8B84B]/15 text-[#E8B84B]" : "bg-white/8 text-white/40"}`}>
                        {emp.role === "ADMIN" ? "Admin" : "Empleado"}
                      </span>
                    </div>
                    <p className="text-base font-black text-[#E8B84B]">${emp.totalPay.toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="font-black text-white text-base">{emp.totalHours}h</p>
                      <p className="text-white/30 mt-1">Total</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="font-black text-white text-base">{emp.regularHours}h</p>
                      <p className="text-white/30 mt-1">Normales</p>
                    </div>
                    <div className={`rounded-xl p-3 text-center ${emp.overtimeHours > 0 ? "bg-orange-500/10" : "bg-white/5"}`}>
                      <p className={`font-black text-base ${emp.overtimeHours > 0 ? "text-orange-400" : "text-white"}`}>{emp.overtimeHours}h</p>
                      <p className="text-white/30 mt-1">Extra</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="font-black text-white text-base">${emp.hourlyRate}</p>
                      <p className="text-white/30 mt-1">Tarifa</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}