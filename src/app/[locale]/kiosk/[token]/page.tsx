import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import KioskClient from "@/components/kiosk/KioskClient";

export default async function KioskPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const kiosk = await prisma.kioskSession.findUnique({
    where: { token, isActive: true },
    include: { organization: true },
  });

  if (!kiosk) notFound();

  const employees = await prisma.user.findMany({
    where: {
      organizationId: kiosk.organizationId,
      isActive: true,
      role: "EMPLOYEE",
    },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const activeEntries = await prisma.timeEntry.findMany({
    where: {
      organizationId: kiosk.organizationId,
      status: "CLOCKED_IN",
    },
    select: { userId: true },
  });

  const activeUserIds = activeEntries.map((e) => e.userId);

  return (
    <KioskClient
      token={token}
      organizationName={kiosk.organization.name}
      employees={employees}
      activeUserIds={activeUserIds}
      exitPin={kiosk.exitPin}
    />
  );
}