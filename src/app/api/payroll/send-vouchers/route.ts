import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });

  const orgId = (session.user as any).organizationId;

  try {
    const { period, vouchers } = await req.json();

    if (!period || !vouchers || !Array.isArray(vouchers) || vouchers.length === 0) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // Usar una transacción para insertar o actualizar los bauchers
    await prisma.$transaction(
      vouchers.map((v: any) => 
        prisma.paymentVoucher.upsert({
          where: {
            userId_period: {
              userId: v.userId,
              period: period
            }
          },
          update: {
            totalHours: v.totalHours,
            overtimeHours: v.overtimeHours,
            hourlyRate: v.hourlyRate,
            totalPay: v.totalPay
          },
          create: {
            organizationId: orgId,
            userId: v.userId,
            period: period,
            totalHours: v.totalHours,
            overtimeHours: v.overtimeHours,
            hourlyRate: v.hourlyRate,
            totalPay: v.totalPay
          }
        })
      )
    );

    return NextResponse.json({ success: true, count: vouchers.length });
  } catch (error: any) {
    console.error("Voucher Send Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
