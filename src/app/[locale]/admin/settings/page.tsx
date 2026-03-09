import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/admin/SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/en/login");

  const orgId = (session.user as any).organizationId;
  
  // Buscamos la organización incluyendo la suscripción para calcular los días
  const org = await prisma.organization.findUnique({ 
    where: { id: orgId },
    include: { subscription: true }
  });

  if (!org) redirect("/en/login");

  // Calculamos isPro y daysLeft basados en tu esquema de Subscription
  const isPro = org.subscription?.status === "ACTIVE" || org.subscription?.tier === "PRO";
  
  const daysLeft = org.subscription?.trialEndsAt 
    ? Math.max(0, Math.ceil((new Date(org.subscription.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Settings</h1>
          <p className="text-xs text-[var(--text-muted)]">Configura tu empresa y cuenta</p>
        </div>
      </div>
      <div className="p-6 max-w-2xl space-y-4">
        {/* Pasamos exactamente las props que SettingsClient espera según el error de TypeScript */}
        <SettingsClient
          org={org}
          isPro={isPro}
          daysLeft={daysLeft}
        />
      </div>
    </div>
  );
}