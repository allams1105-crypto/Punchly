import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const where: any = { organizationId: orgId };
  if (userId) where.userId = userId;

  const entries = await prisma.timeEntry.findMany({
    where,
    include: { user: { select: { name: true } } },
    orderBy: { clockIn: "desc" },
    take: 50,
  });

  return NextResponse.json({ entries });
}