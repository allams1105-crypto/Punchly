import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const { userId, avatarColor } = await req.json();
    await prisma.user.update({
      where: { id: userId, organizationId: orgId },
      data: { avatarColor } as any,
    });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Avatar error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}