import { writeFileSync } from "fs";

const content = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ClockButton from "@/components/employee/ClockButton";
import WeeklyCalendar from "@/components/employee/WeeklyCalendar";

export default async function EmployeeDashboard() {
  const session = await auth();
  if (!session) redirect("/en/login");

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { organization: true },
  });

  if (!user) redirect("/en/login");

  const now = new Date();

  const day = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const entries = await prisma.timeEntry.findMany({
    where: { userId },
    orderBy: { clockIn: "desc" },
    take: 50,
  });

  const weeklyMinutes = entries
    .filter((e) => new Date(e.clockIn) >= weekStart)
    .reduce((acc, e) => acc + (e.durationMin || 0), 0);

  const monthlyMinutes = entries
    .filter((e) => new Date(e.clockIn) >= monthStart)
    .reduce((acc, e) => acc + (e.durationMin || 0), 0);

  const activeEntry = entries.find((e) => e.status === "CLOCKED_IN") || null;

  const serializedEntries = entries.map((e) => ({
    id: e.id,
    clockIn: e.clockIn.toISOString(),
    clockOut: e.clockOut ? e.clockOut.toISOString() : null,
    durationMin: e.durationMin,
    status: e.status,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">Punchly</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 text-sm">{user.organization.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user.name}</span>
          <a href="/api/auth/signout" className="text-xs text-gray-400 hover:text-gray-700">
            Salir
          </a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <ClockButton
          isActive={!!activeEntry}
          entryId={activeEntry?.id}
          clockInTime={activeEntry?.clockIn.toISOString()}
        />
        <WeeklyCalendar
          entries={serializedEntries}
          weeklyMinutes={weeklyMinutes}
          monthlyMinutes={monthlyMinutes}
        />
      </div>
    </div>
  );
}`;

writeFileSync("src/app/[locale]/employee/dashboard/page.tsx", content);
console.log("Listo!");

