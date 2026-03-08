"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

interface EmpPayroll {
  id: string;
  name: string;
  role: string;
  hourlyRate: number | null;
  overtimeRate: number | null;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  totalPay: number;
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
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      });
  }, [year, month, half]);

  const totalPayroll = data.reduce((acc, e) => acc + e.totalPay, 0);
  const periodLabel = half === "1" ? `1 — 15 ${MONTHS[month - 1]} ${year}` : `16 — ${new Date(year, month, 0).getDate()} ${MONTHS[month - 1]} ${year}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900 dark:text-white">Punchly</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">Historial de Nomina</span>
        </div>
        <Link href="/en/admin/dashboard" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Volver</Link>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Selector */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Ano</label>
              <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm">
                {[2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Mes</label>
              <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm">
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Quincena</label>
              <select value={half} onChange={(e) => setHalf(e.target.value)} className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm">
                <option value="1">Primera (1-15)</option>
                <option value="2">Segunda (16-fin)</option>
              </select>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-gray-400">Periodo</p>
              <p className="text-sm font-semibold text-gray-900">{periodLabel}</p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-violet-600 to-blue-500 rounded-2xl p-6 text-white">
          <p className="text-sm text-violet-200 mb-1">Total nomina</p>
          <p className="text-4xl font-black">${totalPayroll.toLocaleString()}</p>
          <p className="text-sm text-violet-200 mt-1">{data.length} empleados</p>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Desglose por empleado</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-400">Cargando...</div>
          ) : data.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">No hay registros para este periodo</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {data.map((emp) => (
                <div key={emp.id} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${emp.role === "ADMIN" ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-500"}`}>
                        {emp.role === "ADMIN" ? "Admin" : "Empleado"}
                      </span>
                    </div>
                    <p className="text-base font-bold text-gray-900">${emp.totalPay.toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs text-gray-400">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="font-semibold text-gray-700">{emp.totalHours}h</p>
                      <p>Total</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="font-semibold text-gray-700">{emp.regularHours}h</p>
                      <p>Normales</p>
                    </div>
                    <div className={`rounded-lg p-2 text-center ${emp.overtimeHours > 0 ? "bg-orange-50" : "bg-gray-50"}`}>
                      <p className={`font-semibold ${emp.overtimeHours > 0 ? "text-orange-600" : "text-gray-700"}`}>{emp.overtimeHours}h</p>
                      <p>Extra</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="font-semibold text-gray-700">${emp.hourlyRate}/h</p>
                      <p>Tarifa</p>
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