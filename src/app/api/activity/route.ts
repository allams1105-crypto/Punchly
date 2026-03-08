import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });

  const orgId = (session.user as any).organizationId;

  const logs = await prisma.activityLog.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(logs);
}