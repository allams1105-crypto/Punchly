import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/admin/SettingsClient";
import PushRegister from "@/components/PushRegister";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/en/login");
  const orgId = (session.user as any).organizationId;

  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  const createdAt = org?.createdAt ? new Date(org.createdAt) : new Date();
  const daysSince = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, 7 - daysSince);
  const isPro = !!(org as any)?.isPro;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Settings</h1>
          <p className="text-xs text-[var(--text-muted)]">Configuración de tu cuenta y empresa</p>
        </div>
      </div>
      <div className="p-6 max-w-xl space-y-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--border)]">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Notificaciones push</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Recibe alertas de tardanzas y ausencias en tu dispositivo</p>
          </div>
          <div className="p-5">
            <PushRegister />
          </div>
        </div>
        <SettingsClient org={{ name: org?.name, alertEmail: (org as any)?.alertEmail }} isPro={isPro} daysLeft={daysLeft} />
      </div>
    </div>
  );
}