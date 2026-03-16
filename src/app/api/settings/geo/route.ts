import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const { lat, lng, geoRadius } = await req.json();
    if (!lat || !lng) return NextResponse.json({ error: "Latitud y longitud requeridas" }, { status: 400 });
    await prisma.organization.update({
      where: { id: orgId },
      data: { lat: parseFloat(String(lat)), lng: parseFloat(String(lng)), geoRadius: parseInt(String(geoRadius||100)) } as any,
    });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Geo error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const orgId = (session.user as any).organizationId;
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    return NextResponse.json({
      lat: (org as any)?.lat || null,
      lng: (org as any)?.lng || null,
      geoRadius: (org as any)?.geoRadius || 100
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}