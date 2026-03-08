import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ClockButton from "@/components/employee/ClockButton";
import WeeklyCalendar from "@/components/employee/WeeklyCalendar";
import ThemeToggle from "@/components/ThemeToggle";

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

  const weeklyHours = Math.floor(weeklyMinutes / 60);
  const weeklyMins = weeklyMinutes % 60;
  const monthlyHours = Math.floor(monthlyMinutes / 60);

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-black border-b border-white/8 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#E8B84B] rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xs">P</span>
          </div>
          <span className="text-white font-black text-lg tracking-tight">Punchly.Clock</span>
          <span className="text-white/20 mx-1">|</span>
          <span className="text-white/40 text-sm">{user.organization.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/50">{user.name}</span>
          <ThemeToggle />
          <a href="/api/auth/signout" className="text-xs text-white/30 hover:text-white/70 transition">Salir</a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Esta semana</p>
            <p className="text-3xl font-black text-white">{weeklyHours}h {weeklyMins}m</p>
          </div>
          <div className="bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-2xl p-5">
            <p className="text-xs text-[#E8B84B]/60 uppercase tracking-wider mb-2">Este mes</p>
            <p className="text-3xl font-black text-[#E8B84B]">{monthlyHours}h</p>
          </div>
        </div>

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
}