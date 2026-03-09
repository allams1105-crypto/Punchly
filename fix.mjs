import { writeFileSync } from "fs";

const content = `"use client";
import { useEffect, useState } from "react";

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function PayrollPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [half, setHalf] = useState(now.getDate() <= 15 ? 1 : 2);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(\`/api/payroll?month=\${month}&year=\${year}&half=\${half}\`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, [month, year, half]);

  const total = data?.employees?.reduce((acc: number, e: any) => acc + e.totalPay, 0) || 0;
  const periodLabel = half === 1 ? \`1 — 15 \${MONTHS[month]} \${year}\` : \`16 — fin \${MONTHS[month]} \${year}\`;

  function exportCSV() {
    window.open(\`/api/payroll/export?format=csv&month=\${month}&year=\${year}&half=\${half}\`, "_blank");
  }

  function exportPDF() {
    window.open(\`/api/payroll/export?format=html&month=\${month}&year=\${year}&half=\${half}\`, "_blank");
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center justify-between bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Nómina</h1>
          <p className="text-xs text-[var(--text-muted)]">{periodLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-[#E8B84B] mr-2">\${total.toLocaleString()}</span>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-lg text-xs font-semibold transition">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            CSV
          </button>
          <button onClick={exportPDF}
            className="flex items-center gap-1.5 bg-[#E8B84B] text-black px-3 py-1.5 rounded-lg text-xs font-black hover:bg-[#d4a43a] transition">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            PDF
          </button>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <select value={month} onChange={e => setMonth(Number(e.target.value))}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B]">
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#E8B84B]">
            {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="flex bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <button onClick={() => setHalf(1)}
              className={\`px-4 py-2 text-sm font-medium transition \${half === 1 ? "bg-[#E8B84B] text-black" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}\`}>
              1 — 15
            </button>
            <button onClick={() => setHalf(2)}
              className={\`px-4 py-2 text-sm font-medium transition \${half === 2 ? "bg-[#E8B84B] text-black" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}\`}>
              16 — fin
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-5 py-3 border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider col-span-2">Empleado</p>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider text-right">Horas</p>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider text-right">Extras</p>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider text-right">Total</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">Cargando...</div>
          ) : !data?.employees?.length ? (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">Sin registros para este período</div>
          ) : data.employees.map((emp: any) => (
            <div key={emp.id} className="grid grid-cols-5 gap-4 px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)]/30 transition">
              <div className="col-span-2">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{emp.name}</p>
                <p className="text-xs text-[var(--text-muted)]">\${emp.hourlyRate}/h</p>
              </div>
              <p className="text-sm text-[var(--text-primary)] text-right self-center">{emp.totalHours}h</p>
              <p className="text-sm text-right self-center">
                {emp.overtimeHours > 0 ? <span className="text-orange-400">{emp.overtimeHours}h</span> : <span className="text-[var(--text-muted)]">—</span>}
              </p>
              <p className="text-sm font-black text-[#E8B84B] text-right self-center">\${emp.totalPay.toLocaleString()}</p>
            </div>
          ))}
          {data?.employees?.length > 0 && (
            <div className="grid grid-cols-5 gap-4 px-5 py-4 bg-[#E8B84B]/5 border-t border-[#E8B84B]/20">
              <p className="text-sm font-black text-[var(--text-primary)] col-span-4">Total nómina</p>
              <p className="text-sm font-black text-[#E8B84B] text-right">\${total.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`;

writeFileSync("src/app/[locale]/admin/payroll/page.tsx", content);
console.log("Listo!");

