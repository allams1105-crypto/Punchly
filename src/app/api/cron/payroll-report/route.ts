import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const now = new Date();
  const isFirstHalf = now.getUTCDate() <= 15;
  const periodStart = isFirstHalf
    ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 16));
  const periodEnd = isFirstHalf
    ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 15, 23, 59, 59))
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));
  const periodDays = isFirstHalf ? 15 : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate() - 15;
  const maxRegularHours = 8 * periodDays;

  const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const periodLabel = isFirstHalf
    ? `1 — 15 ${MONTHS[now.getUTCMonth()]} ${now.getUTCFullYear()}`
    : `16 — ${new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate()} ${MONTHS[now.getUTCMonth()]} ${now.getUTCFullYear()}`;

  const organizations = await prisma.organization.findMany({
    include: {
      users: {
        where: { isActive: true, role: { in: ["OWNER", "ADMIN"] } },
      },
    },
  });

  for (const org of organizations) {
    const employees = await prisma.user.findMany({
      where: { organizationId: org.id, isActive: true },
      include: {
        timeEntries: {
          where: { status: "CLOCKED_OUT", clockIn: { gte: periodStart, lte: periodEnd } },
        },
      },
    });

    const payrollData = employees.map((emp) => {
      const totalMinutes = emp.timeEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0);
      const totalHours = totalMinutes / 60;
      const regularHours = Math.min(totalHours, maxRegularHours);
      const overtimeHours = Math.max(0, totalHours - maxRegularHours);
      const totalPay = regularHours * (emp.hourlyRate || 0) + overtimeHours * (emp.overtimeRate || 0);
      return {
        name: emp.name,
        totalHours: Math.round(totalHours * 10) / 10,
        regularHours: Math.round(regularHours * 10) / 10,
        overtimeHours: Math.round(overtimeHours * 10) / 10,
        totalPay: Math.round(totalPay * 100) / 100,
      };
    });

    const totalPayroll = payrollData.reduce((acc, e) => acc + e.totalPay, 0);

    const rows = payrollData.map((emp) => `
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 12px 0; font-size: 14px; color: #111;">${emp.name}</td>
        <td style="padding: 12px 0; font-size: 14px; color: #6b7280; text-align: center;">${emp.totalHours}h</td>
        <td style="padding: 12px 0; font-size: 14px; color: #6b7280; text-align: center;">${emp.regularHours}h</td>
        <td style="padding: 12px 0; font-size: 14px; color: ${emp.overtimeHours > 0 ? "#ea580c" : "#6b7280"}; text-align: center;">${emp.overtimeHours}h</td>
        <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #111; text-align: right;">$${emp.totalPay.toLocaleString()}</td>
      </tr>
    `).join("");

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111; margin-bottom: 4px;">Punchly</h2>
        <p style="color: #666; font-size: 14px; margin-bottom: 24px;">${org.name}</p>
        <div style="background: linear-gradient(135deg, #7c3aed, #3b82f6); border-radius: 16px; padding: 24px; margin-bottom: 24px; color: white;">
          <p style="margin: 0; font-size: 13px; opacity: 0.8;">Reporte quincenal</p>
          <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.8;">${periodLabel}</p>
          <p style="margin: 16px 0 0; font-size: 36px; font-weight: 900;">$${totalPayroll.toLocaleString()}</p>
          <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.8;">${employees.length} empleados</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #e5e7eb;">
              <th style="padding: 8px 0; font-size: 12px; color: #9ca3af; text-align: left;">Empleado</th>
              <th style="padding: 8px 0; font-size: 12px; color: #9ca3af; text-align: center;">Total</th>
              <th style="padding: 8px 0; font-size: 12px; color: #9ca3af; text-align: center;">Normales</th>
              <th style="padding: 8px 0; font-size: 12px; color: #9ca3af; text-align: center;">Extra</th>
              <th style="padding: 8px 0; font-size: 12px; color: #9ca3af; text-align: right;">Pago</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="color: #d1d5db; font-size: 11px; margin-top: 32px;">Este reporte fue generado automaticamente por Punchly</p>
      </div>
    `;

    for (const admin of org.users) {
      if (admin.email) {
        await resend.emails.send({
          from: "Punchly <onboarding@resend.dev>",
          to: admin.email,
          subject: `Reporte quincenal — ${periodLabel} — ${org.name}`,
          html,
        });
      }
    }
  }

  return NextResponse.json({ success: true, orgs: organizations.length });
}