import { auth } from "@/lib/auth";
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
}