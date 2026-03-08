import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const orgId = (session.user as any).organizationId;
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  return NextResponse.json({ name: org?.name });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });

  const orgId = (session.user as any).organizationId;
  const { name } = await req.json();

  await prisma.organization.update({
    where: { id: orgId },
    data: { name },
  });

  return NextResponse.json({ success: true });
}