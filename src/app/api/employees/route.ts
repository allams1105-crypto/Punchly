import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const employees = await prisma.user.findMany({
      where: { organizationId: orgId, role: { not: "OWNER" }, isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ employees });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}