import { writeFileSync } from "fs";

// Fix kiosk setup page — use orgId directly as token
const kioskSetup = `import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function KioskSetupPage() {
  const session = await auth();
  if (!session) redirect("/en/login");
  const orgId = (session.user as any).organizationId;
  const kioskUrl = \`\${process.env.NEXTAUTH_URL || "https://punchlyclock.vercel.app"}/en/kiosk/\${orgId}\`;

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
              <p className="text-sm font-mono text-[#E8B84B] break-all">{kioskUrl}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <KioskCopyButton url={kioskUrl} />
              <a href={kioskUrl} target="_blank"
                className="flex items-center justify-center gap-2 bg-[#E8B84B] text-black py-3 rounded-xl text-sm font-black hover:bg-[#d4a43a] transition">
                Abrir Kiosk →
              </a>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-400 mb-1">¿Cómo funciona?</p>
              <ul className="text-xs text-blue-300/70 space-y-1">
                <li>1. Abre la URL en la tablet de la entrada</li>
                <li>2. El empleado toca su nombre</li>
                <li>3. Ingresa su PIN de 4 dígitos</li>
                <li>4. Se registra la entrada o salida</li>
              </ul>
            </div>
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4">
              <p className="text-xs font-semibold text-[var(--text-muted)] mb-1">Asignar PINs a empleados</p>
              <p className="text-xs text-[var(--text-muted)]">Ve a <strong className="text-[var(--text-primary)]">Empleados → editar empleado → PIN del Kiosk</strong> para asignar el PIN de cada uno.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KioskCopyButton({ url }: { url: string }) {
  return (
    <button onClick={() => {
      if (typeof window !== "undefined") navigator.clipboard.writeText(url);
    }}
      className="flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] py-3 rounded-xl text-sm font-semibold transition">
      Copiar URL
    </button>
  );
}`;

// Fix kiosk page — search by orgId directly
const kioskPage = `import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import KioskClient from "@/components/kiosk/KioskClient";

export default async function KioskPage({ params }: { params: any }) {
  const { token } = await params;
  if (!token) notFound();

  // token IS the orgId
  const org = await prisma.organization.findUnique({ where: { id: token } });
  if (!org) notFound();

  const today = new Date(); today.setHours(0,0,0,0);

  const [employees, activeEntries] = await Promise.all([
    prisma.user.findMany({
      where: { organizationId: org.id, isActive: true, role: { not: "OWNER" } },
      orderBy: { name: "asc" },
    }),
    prisma.timeEntry.findMany({
      where: { organizationId: org.id, clockOut: null, clockIn: { gte: today } },
    }),
  ]);

  const activeIds = new Set(activeEntries.map(e => e.userId));

  return (
    <KioskClient
      token={org.id}
      employees={employees.map(e => ({
        id: e.id,
        name: e.name || "",
        avatarColor: (e as any).avatarColor || null,
        onShift: activeIds.has(e.id),
        clockInTime: activeEntries.find(a => a.userId === e.id)?.clockIn?.toISOString() || null,
      }))}
    />
  );
}`;

writeFileSync("src/app/[locale]/admin/kiosk/page.tsx", kioskSetup);
writeFileSync("src/app/[locale]/kiosk/[token]/page.tsx", kioskPage);
console.log("Listo!");

