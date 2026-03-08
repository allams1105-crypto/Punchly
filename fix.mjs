import { writeFileSync, mkdirSync } from "fs";

// Banner component
const banner = `"use client";
import Link from "next/link";

export default function TrialBanner({ daysLeft, expired }: { daysLeft: number; expired: boolean }) {
  if (!expired && daysLeft > 7) return null;

  return (
    <div className={\`w-full px-4 py-2.5 flex items-center justify-between gap-3 \${expired ? "bg-red-500/10 border-b border-red-500/20" : "bg-[#E8B84B]/10 border-b border-[#E8B84B]/20"}\`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={\`w-1.5 h-1.5 rounded-full shrink-0 \${expired ? "bg-red-400" : "bg-[#E8B84B]"}\`} />
        <p className={\`text-xs font-medium truncate \${expired ? "text-red-400" : "text-[#E8B84B]"}\`}>
          {expired
            ? "Tu período de prueba ha terminado — actualiza a Pro para seguir usando Punchly.Clock"
            : \`Te quedan \${daysLeft} días de prueba gratis\`}
        </p>
      </div>
      <Link href="/en/admin/settings"
        className={\`shrink-0 text-xs font-black px-3 py-1.5 rounded-lg transition \${expired ? "bg-red-500 text-white hover:bg-red-600" : "bg-[#E8B84B] text-black hover:bg-[#d4a43a]"}\`}>
        {expired ? "Actualizar ahora" : "Ver planes"}
      </Link>
    </div>
  );
}`;

writeFileSync("src/components/admin/TrialBanner.tsx", banner);

// Update admin layout to include trial banner
const layout = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import TrialBanner from "@/components/admin/TrialBanner";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/en/login");

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") redirect("/en/employee/dashboard");

  const orgId = (session.user as any).organizationId;
  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  // Trial logic
  const createdAt = org?.createdAt ? new Date(org.createdAt) : new Date();
  const daysSinceCreation = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const trialDays = 14;
  const daysLeft = Math.max(0, trialDays - daysSinceCreation);
  const trialExpired = daysSinceCreation > trialDays;

  // Check active subscription
  const subscription = await prisma.subscription.findFirst({
    where: { organizationId: orgId, status: "active" },
  });
  const isPro = !!subscription;

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      <Sidebar orgName={org?.name || "Mi Empresa"} />
      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        {!isPro && <TrialBanner daysLeft={daysLeft} expired={trialExpired} />}
        {children}
      </div>
    </div>
  );
}`;

writeFileSync("src/app/[locale]/admin/layout.tsx", layout);
console.log("Listo!");

