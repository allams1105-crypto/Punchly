"use client";
export default function ExportButtons() {
  return (
    <div className="flex items-center gap-2">
      <a href="/api/payroll/export?format=csv" download
        className="flex items-center gap-1.5 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-2 rounded-lg text-xs font-semibold transition">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        CSV
      </a>
      <a href="/api/payroll/export?format=html" target="_blank"
        className="flex items-center gap-1.5 bg-[#E8B84B] text-black px-3 py-2 rounded-lg text-xs font-black hover:bg-[#d4a43a] transition">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Imprimir PDF
      </a>
    </div>
  );
}