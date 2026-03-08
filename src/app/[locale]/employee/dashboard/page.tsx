import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ClockButton from "@/components/employee/ClockButton";
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

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const entries = await prisma.timeEntry.findMany({
    where: { userId },
    orderBy: { clockIn: "desc" },
    take: 30,
  });

  const todayMinutes = entries
    .filter(e => new Date(e.clockIn) >= todayStart && e.status === "CLOCKED_OUT")
    .reduce((acc, e) => acc + (e.durationMin || 0), 0);

  const weeklyMinutes = entries
    .filter(e => new Date(e.clockIn) >= weekStart && e.status === "CLOCKED_OUT")
    .reduce((acc, e) => acc + (e.durationMin || 0), 0);

  const monthlyMinutes = entries
    .filter(e => new Date(e.clockIn) >= monthStart && e.status === "CLOCKED_OUT")
    .reduce((acc, e) => acc + (e.durationMin || 0), 0);

  const activeEntry = entries.find(e => e.status === "CLOCKED_IN") || null;

  const recentEntries = entries
    .filter(e => e.status === "CLOCKED_OUT")
    .slice(0, 7);

  const todayH = Math.floor(todayMinutes / 60);
  const todayM = todayMinutes % 60;
  const weekH = Math.floor(weeklyMinutes / 60);
  const weekM = weeklyMinutes % 60;
  const monthH = Math.floor(monthlyMinutes / 60);

  const DAYS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Topbar */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#E8B84B] rounded-xl flex items-center justify-center shadow-lg shadow-[#E8B84B]/20">
            <span className="text-black font-black text-sm">P</span>
          </div>
          <div>
            <p className="text-[var(--text-primary)] font-black text-sm leading-none">Punchly.Clock</p>
            <p className="text-[var(--text-muted)] text-xs">{user.organization.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-[var(--text-primary)]">{user.name}</p>
            <p className="text-xs text-[var(--text-muted)]">Empleado</p>
          </div>
          <a href="/api/auth/signout"
            className="text-xs border border-[var(--border)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition">
            Salir
          </a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-4">

        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-[var(--text-primary)]">Hola, {user.name.split(" ")[0]} 👋</h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {now.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          {activeEntry && (
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-green-400">En turno</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1.5">Hoy</p>
            <p className="text-xl font-black text-[var(--text-primary)]">{todayH}h {todayM}m</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1.5">Esta semana</p>
            <p className="text-xl font-black text-[var(--text-primary)]">{weekH}h {weekM}m</p>
          </div>
          <div className="bg-[#E8B84B]/10 border border-[#E8B84B]/20 rounded-xl p-4">
            <p className="text-xs text-[#E8B84B]/60 mb-1.5">Este mes</p>
            <p className="text-xl font-black text-[#E8B84B]">{monthH}h</p>
          </div>
        </div>

        {/* Clock button */}
        <ClockButton
          isActive={!!activeEntry}
          entryId={activeEntry?.id}
          clockInTime={activeEntry?.clockIn.toISOString()}
        />

        {/* Recent entries */}
        {recentEntries.length > 0 && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-[var(--border)]">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Historial reciente</h2>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {recentEntries.map((entry) => {
                const clockIn = new Date(entry.clockIn);
                const clockOut = entry.clockOut ? new Date(entry.clockOut) : null;
                const h = Math.floor((entry.durationMin || 0) / 60);
                const m = (entry.durationMin || 0) % 60;
                const isToday = clockIn >= todayStart;
                return (
                  <div key={entry.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg flex flex-col items-center justify-center shrink-0">
                        <p className="text-xs font-black text-[var(--text-primary)] leading-none">{clockIn.getDate()}</p>
                        <p className="text-xs text-[var(--text-muted)] leading-none">{DAYS[clockIn.getDay()]}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-primary)]">
                          {clockIn.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                          {clockOut && ` — ${clockOut.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}`}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">{h}h {m}m trabajados</p>
                      </div>
                    </div>
                    {isToday && <span className="text-xs bg-[#E8B84B]/10 text-[#E8B84B] px-2 py-0.5 rounded-full font-medium">Hoy</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}