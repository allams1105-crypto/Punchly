import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const userId = (session.user as any).id;
  const { currentPassword, newPassword } = await req.json();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.pin) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  const valid = await bcrypt.compare(currentPassword, user.pin);
  if (!valid) return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { pin: hash } });
  return NextResponse.json({ ok: true });
}