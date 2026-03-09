import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;

  const { userId, avatarUrl, avatarColor } = await req.json();

  const user = await prisma.user.findFirst({ where: { id: userId, organizationId: orgId } });
  if (!user) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl, avatarColor } as any,
  });

  return NextResponse.json({ success: true });
}