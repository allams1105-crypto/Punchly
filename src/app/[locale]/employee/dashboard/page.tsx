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
  const todayEntries = entries.filter((e) => {
    const d = new Date(e.clockIn);
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
  });
  const todayMinutes = todayEntries.reduce((acc, e) => acc + (e.durationMin || 0), 0);
  const todayHours = Math.floor(todayMinutes / 60);
  const todayMins = todayMinutes % 60;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Topbar */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border)] px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#E8B84B] rounded-xl flex items-center justify-center shadow-lg shadow-[#E8B84B]/20">
            <span className="text-black font-black text-sm">P</span>
          </div>
          <div>
            <p className="text-[var(--text-primary)] font-black text-sm leading-none">Punchly.Clock</p>
            <p className="text-[var(--text-muted)] text-xs">{user.organization.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-[var(--text-primary)]">{user.name}</p>
            <p className="text-xs text-[var(--text-muted)]">Empleado</p>
          </div>
          <ThemeToggle />
          <a href="/api/auth/signout"
            className="text-xs border border-[var(--border)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition">
            Salir
          </a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Hoy</p>
            <p className="text-2xl font-black text-[var(--text-primary)]">{todayHours}h {todayMins}m</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Esta semana</p>
            <p className="text-2xl font-black text-[var(--text-primary)]">{weeklyHours}h {weeklyMins}m</p>
          </div>
          <div className="bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-2xl p-4">
            <p className="text-xs text-[#E8B84B]/60 uppercase tracking-wider mb-2">Este mes</p>
            <p className="text-2xl font-black text-[#E8B84B]">{monthlyHours}h</p>
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