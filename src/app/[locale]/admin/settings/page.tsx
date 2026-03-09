import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/admin/SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/en/login");

  const orgId = (session.user as any).organizationId;
  const userId = (session.user as any).id;
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="h-14 border-b border-[var(--border)] px-6 flex items-center bg-[var(--bg-primary)]">
        <div>
          <h1 className="text-sm font-black text-[var(--text-primary)]">Settings</h1>
          <p className="text-xs text-[var(--text-muted)]">Configura tu empresa y cuenta</p>
        </div>
      </div>
      <div className="p-6 max-w-2xl space-y-4">
        <SettingsClient
          orgId={orgId}
          orgName={org?.name || ""}
          userName={user?.name || ""}
          userEmail={user?.email || ""}
          isPro={!!(org as any)?.isPro}
        />
      </div>
    </div>
  );
}