import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const orgId = (session.user as any).organizationId;
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "html";

  const now = new Date();
  const isFirstHalf = now.getUTCDate() <= 15;
  const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const periodStart = isFirstHalf
    ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 16));
  const periodEnd = isFirstHalf
    ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 15, 23, 59, 59))
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));
  const periodDays = isFirstHalf ? 15 : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate() - 15;
  const maxRegularHours = 8 * periodDays;
  const periodLabel = isFirstHalf
    ? `1 — 15 ${MONTHS[now.getUTCMonth()]} ${now.getUTCFullYear()}`
    : `16 — ${new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate()} ${MONTHS[now.getUTCMonth()]} ${now.getUTCFullYear()}`;

  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  const employees = await prisma.user.findMany({
    where: { organizationId: orgId, isActive: true },
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
      hourlyRate: emp.hourlyRate || 0,
    };
  });

  const totalPayroll = payrollData.reduce((acc, e) => acc + e.totalPay, 0);

  if (format === "csv") {
    const csv = [
      "Empleado,Horas Totales,Horas Regulares,Horas Extra,Tarifa/h,Total",
      ...payrollData.map(e => `${e.name},${e.totalHours},${e.regularHours},${e.overtimeHours},$${e.hourlyRate},$${e.totalPay}`),
      `TOTAL,,,,,$${totalPayroll.toLocaleString()}`,
    ].join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="nomina-${periodLabel.replace(/\s/g,"-")}.csv"`,
      },
    });
  }

  const rows = payrollData.map(emp => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${emp.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;">${emp.totalHours}h</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;">${emp.regularHours}h</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;color:${emp.overtimeHours > 0 ? "#ea580c" : "#6b7280"};">${emp.overtimeHours}h</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;">$${emp.hourlyRate}/h</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:right;font-weight:700;color:#E8B84B;">$${emp.totalPay.toLocaleString()}</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nómina ${periodLabel}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; background: #f9fafb; padding: 40px; color: #111; }
    .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { background: #000; padding: 32px; display: flex; justify-content: space-between; align-items: center; }
    .logo { display: flex; align-items: center; gap: 10px; }
    .logo-icon { width: 36px; height: 36px; background: #E8B84B; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; color: black; }
    .logo-text { color: white; font-weight: 900; font-size: 18px; }
    .period { color: rgba(255,255,255,0.5); font-size: 13px; text-align: right; }
    .period strong { color: #E8B84B; display: block; font-size: 15px; }
    .summary { background: #E8B84B; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; }
    .summary h2 { font-size: 13px; color: rgba(0,0,0,0.5); margin-bottom: 4px; }
    .summary .amount { font-size: 36px; font-weight: 900; color: black; }
    .summary .meta { font-size: 13px; color: rgba(0,0,0,0.5); }
    .body { padding: 32px; }
    table { width: 100%; border-collapse: collapse; }
    thead th { padding: 8px 12px; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; border-bottom: 2px solid #e5e7eb; }
    thead th:not(:first-child) { text-align: center; }
    thead th:last-child { text-align: right; }
    .footer { padding: 20px 32px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; }
    .footer p { font-size: 11px; color: #9ca3af; }
    .total-row td { padding: 12px; font-weight: 900; font-size: 14px; background: #f9fafb; }
    @media print { body { padding: 0; background: white; } .container { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <div class="logo-icon">P</div>
        <span class="logo-text">Punchly.Clock</span>
      </div>
      <div class="period">
        <span>Período</span>
        <strong>${periodLabel}</strong>
      </div>
    </div>
    <div class="summary">
      <div>
        <h2>Nómina total estimada</h2>
        <div class="amount">$${totalPayroll.toLocaleString()}</div>
        <div class="meta">${org?.name} · ${employees.length} empleados</div>
      </div>
      <div style="text-align:right;">
        <div class="meta">Generado el</div>
        <strong style="font-size:14px;">${now.toLocaleDateString("es",{day:"numeric",month:"long",year:"numeric"})}</strong>
      </div>
    </div>
    <div class="body">
      <table>
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Horas totales</th>
            <th>Regulares</th>
            <th>Extra</th>
            <th>Tarifa</th>
            <th style="text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr class="total-row">
            <td colspan="5">Total nómina</td>
            <td style="text-align:right;color:#E8B84B;">$${totalPayroll.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <p>Punchly.Clock · Reporte automático</p>
      <p>${periodLabel}</p>
    </div>
  </div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}