import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const orgId = (session.user as any).organizationId;
  const { alertEmail } = await req.json();
  await prisma.organization.update({ where: { id: orgId }, data: { alertEmail } });
  return NextResponse.json({ success: true });
}