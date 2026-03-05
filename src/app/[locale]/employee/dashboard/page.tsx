import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClockButton from "@/components/employee/ClockButton";

export default async function EmployeeDashboard() {
  const session = await auth();
  if (!session) redirect("/en/login");

  const userId = (session.user as any).id;

  const activeEntry = await prisma.timeEntry.findFirst({
    where: { userId, status: "CLOCKED_IN" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayEntries = await prisma.timeEntry.findMany({
    where: {
      userId,
      clockIn: { gte: today },
    },
    orderBy: { clockIn: "desc" },
  });

  const todayMinutes = todayEntries.reduce((acc, entry) => {
    if (entry.durationMin) return acc + entry.durationMin;
    if (entry.status === "CLOCKED_IN") {
      return acc + Math.floor((new Date().getTime() - entry.clockIn.getTime()) / 60000);
    }
    return acc;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">Punchly</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session.user?.name}</span>
          <a href="/api/auth/signout" className="text-sm text-gray-500 hover:text-gray-900">
            Salir
          </a>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6 ${activeEntry ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            <span className={`w-2 h-2 rounded-full ${activeEntry ? "bg-green-500" : "bg-gray-400"}`} />
            {activeEntry ? "En turno" : "Sin registrar"}
          </div>
          <ClockButton
            isActive={!!activeEntry}
            entryId={activeEntry?.id}
            clockInTime={activeEntry?.clockIn?.toISOString()}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">Hoy</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">Registros hoy</p>
            <p className="text-2xl font-bold text-gray-900">{todayEntries.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Historial de hoy</h2>
          </div>
          {todayEntries.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No hay registros hoy</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {todayEntries.map((entry) => (
                <div key={entry.id} className="px-5 py-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(entry.clockIn).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                    {entry.clockOut && ` → ${new Date(entry.clockOut).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}`}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${entry.status === "CLOCKED_IN" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {entry.durationMin ? `${Math.floor(entry.durationMin / 60)}h ${entry.durationMin % 60}m` : "Activo"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}