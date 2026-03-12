import { writeFileSync, readFileSync } from "fs";

function addLang(content) {
  // Add useLang import if not present
  if (!content.includes("useLang")) {
    content = content.replace(
      `"use client";`,
      `"use client";\nimport { useLang } from "@/lib/LangContext";`
    );
  }
  return content;
}

// Attendance
let attendance = readFileSync("src/app/[locale]/admin/attendance/page.tsx", "utf8");
attendance = addLang(attendance);
attendance = attendance.replace(
  /export default function \w+\([^)]*\)\s*\{/,
  match => match + `\n  const { lang } = useLang();\n  const t = lang === "es" ? { title: "Asistencia", search: "Buscar empleado...", export: "Exportar CSV", from: "Desde", to: "Hasta", days: "días", noData: "Sin registros", name: "Empleado", date: "Fecha", in: "Entrada", out: "Salida", hours: "Horas", status: "Estado", late: "Tarde", onTime: "A tiempo", absent: "Ausente" } : { title: "Attendance", search: "Search employee...", export: "Export CSV", from: "From", to: "To", days: "days", noData: "No records", name: "Employee", date: "Date", in: "Clock In", out: "Clock Out", hours: "Hours", status: "Status", late: "Late", onTime: "On time", absent: "Absent" };`
);
writeFileSync("src/app/[locale]/admin/attendance/page.tsx", attendance);

// Payroll
let payroll = readFileSync("src/app/[locale]/admin/payroll/page.tsx", "utf8");
payroll = addLang(payroll);
payroll = payroll.replace(
  /export default function \w+\([^)]*\)\s*\{/,
  match => match + `\n  const { lang } = useLang();\n  const t = lang === "es" ? { title: "Nómina", period: "Período", employee: "Empleado", hours: "Horas", overtime: "Extras", rate: "Tarifa", total: "Total", export: "Exportar CSV", exportPdf: "Exportar PDF", noData: "Sin registros" } : { title: "Payroll", period: "Period", employee: "Employee", hours: "Hours", overtime: "Overtime", rate: "Rate", total: "Total", export: "Export CSV", exportPdf: "Export PDF", noData: "No records" };`
);
writeFileSync("src/app/[locale]/admin/payroll/page.tsx", payroll);

// Activity
let activity = readFileSync("src/app/[locale]/admin/activity/page.tsx", "utf8");
activity = addLang(activity);
activity = activity.replace(
  /export default function \w+\([^)]*\)\s*\{/,
  match => match + `\n  const { lang } = useLang();\n  const t = lang === "es" ? { title: "Actividad", noData: "Sin actividad reciente", clockIn: "Entrada", clockOut: "Salida", late: "Tardanza", absent: "Ausencia" } : { title: "Activity", noData: "No recent activity", clockIn: "Clock In", clockOut: "Clock Out", late: "Late", absent: "Absent" };`
);
writeFileSync("src/app/[locale]/admin/activity/page.tsx", activity);

// Settings
let settings = readFileSync("src/app/[locale]/admin/settings/page.tsx", "utf8");
settings = addLang(settings);
settings = settings.replace(
  /export default function \w+\([^)]*\)\s*\{/,
  match => match + `\n  const { lang } = useLang();\n  const t = lang === "es" ? { title: "Configuración", org: "Organización", password: "Contraseña", alerts: "Alertas", plan: "Plan", save: "Guardar", saving: "Guardando...", saved: "Guardado" } : { title: "Settings", org: "Organization", password: "Password", alerts: "Alerts", plan: "Plan", save: "Save", saving: "Saving...", saved: "Saved" };`
);
writeFileSync("src/app/[locale]/admin/settings/page.tsx", settings);

console.log("Listo!");

