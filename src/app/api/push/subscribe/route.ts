import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const userId = (session.user as any).id;
  const { subscription } = await req.json();

  await prisma.pushSubscription.upsert({
    where: { userId },
    create: { userId, subscription: JSON.stringify(subscription) },
    update: { subscription: JSON.stringify(subscription) },
  });

  return NextResponse.json({ success: true });
}