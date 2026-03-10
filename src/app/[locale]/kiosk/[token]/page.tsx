import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import KioskClient from "@/components/kiosk/KioskClient";

export default async function KioskPage({ params }: { params: any }) {
  const { token } = await params;

  try {
    const org = await prisma.organization.findUnique({ where: { id: token } });
    if (!org) notFound();

    const today = new Date(); today.setHours(0,0,0,0);

    const employees = await prisma.user.findMany({
      where: { organizationId: token, isActive: true, role: { not: "OWNER" } },
      orderBy: { name: "asc" },
    });

    const activeEntries = await prisma.timeEntry.findMany({
      where: { organizationId: token, clockOut: null, clockIn: { gte: today } },
    });
    const activeIds = new Set(activeEntries.map(e => e.userId));

    return (
      <KioskClient
        token={token}
        employees={employees.map(e => ({
          id: e.id,
          name: e.name || "",
          avatarColor: (e as any).avatarColor || null,
          onShift: activeIds.has(e.id),
          clockInTime: activeEntries.find(a => a.userId === e.id)?.clockIn?.toISOString() || null,
        }))}
      />
    );
  } catch(e) {
    console.error("Kiosk error:", e);
    notFound();
  }
}