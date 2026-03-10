import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import KioskClient from "@/components/kiosk/KioskClient";

export default async function KioskPage({ params }: { params: any }) {
  let token: string;
  try { const p = await params; token = p.token; } 
  catch { const p = params; token = p.token; }

  if (!token) notFound();

  const org = await prisma.organization.findFirst({
    where: { OR: [{ id: token }, { slug: token }] },
  });
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
}