import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const orgId = (session.user as any).organizationId;
  const { name, exitPin } = await req.json();

  if (!name || !exitPin) {
    return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
  }

  const hashedPin = await bcrypt.hash(exitPin, 10);

  const kiosk = await prisma.kioskSession.create({
    data: {
      organizationId: orgId,
      name,
      exitPin: hashedPin,
      isActive: true,
    },
  });

  return NextResponse.json({ success: true, token: kiosk.token });
}
