import { writeFileSync } from "fs";

const kioskSetup = `"use client";
import { useEffect, useState } from "react";

export default function KioskSetupPage() {
  const [kioskUrl, setKioskUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/kiosk/info")
      .then(r => r.json())
      .then(d => {
        if (d.orgId) setKioskUrl(\`\${window.location.origin}/en/kiosk/\${d.orgId}\`);
      });
  }, []);

  function copy() {
    navigator.clipboard.writeText(kioskUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Kiosk</h1>
          <p className="text-xs text-[var(--text-muted)]">Punto de fichaje para tus empleados</p>
        </div>
      </div>
      <div className="max-w-lg mx-auto p-6 space-y-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[var(--border)] bg-[#E8B84B]/5">
            <div className="w-10 h-10 bg-[#E8B84B]/15 border border-[#E8B84B]/20 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-[#E8B84B]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
            <h2 className="text-base font-black text-[var(--text-primary)]">Tu Kiosk</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">Abre esta URL en una tablet o PC en la entrada. Tus empleados fichan tocando su nombre e ingresando su PIN.</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4">
              <p className="text-xs text-[var(--text-muted)] mb-2 font-semibold uppercase tracking-wider">URL del Kiosk</p>
              {kioskUrl ? (
                <p className="text-sm font-mono text-[#E8B84B] break-all">{kioskUrl}</p>
              ) : (
                <div className="h-4 bg-[var(--border)] rounded animate-pulse w-3/4" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={copy} disabled={!kioskUrl}
                className="flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] py-3 rounded-xl text-sm font-semibold transition disabled:opacity-40">
                {copied ? "¡Copiado!" : "Copiar URL"}
              </button>
              {kioskUrl ? (
                <a href={kioskUrl} target="_blank"
                  className="flex items-center justify-center gap-2 bg-[#E8B84B] text-black py-3 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition">
                  Abrir Kiosk →
                </a>
              ) : (
                <button disabled className="bg-[#E8B84B]/40 text-black py-3 rounded-xl text-sm font-black opacity-40">
                  Abrir Kiosk →
                </button>
              )}
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-400 mb-2">¿Cómo funciona?</p>
              <div className="space-y-1 text-xs text-blue-300/70">
                <p>1. Abre la URL en la tablet de la entrada</p>
                <p>2. El empleado toca su nombre</p>
                <p>3. Ingresa su PIN de 4 dígitos</p>
                <p>4. Se registra la entrada o salida</p>
              </div>
            </div>
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4">
              <p className="text-xs font-semibold text-[var(--text-muted)] mb-1">Asignar PINs</p>
              <p className="text-xs text-[var(--text-muted)]">Ve a <strong className="text-[var(--text-primary)]">Empleados → editar empleado → PIN del Kiosk</strong> para asignar el PIN de cada uno.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

const kioskInfoApi = `import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;
  return NextResponse.json({ orgId });
}`;

writeFileSync("src/app/[locale]/admin/kiosk/page.tsx", kioskSetup);
writeFileSync("src/app/api/kiosk/info/route.ts", kioskInfoApi);
console.log("Listo!");

