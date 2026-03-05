import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) redirect("/en/login");

  const orgId = (session.user as any).organizationId;

  const [employees, activeEntries] = await Promise.all([
    prisma.user.findMany({
      where: { organizationId: orgId, isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.timeEntry.findMany({
      where: { organizationId: orgId, status: "CLOCKED_IN" },
      include: { user: true },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">Punchly</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 text-sm">Admin</span>
        </div>
        <a href="/api/auth/signout" className="text-sm text-gray-500 hover:text-gray-900">
          Cerrar sesión
        </a>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Total Empleados</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{employees.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Registrados Ahora</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{activeEntries.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Sin Registrar</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{employees.length - activeEntries.length}</p>
          </div>
        </div>

        {activeEntries.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-green-800 mb-3">✅ Registrados ahora</h2>
            <div className="flex flex-wrap gap-2">
              {activeEntries.map((entry) => (
                <span key={entry.id} className="bg-white border border-green-200 text-green-800 text-sm px-3 py-1 rounded-full">
                  {entry.user.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Empleados</h2>
            <a href="/en/admin/kiosk" className="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition mr-2">
  Configurar Kiosk
</a>
            <a href="/en/admin/employees/new" className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition">
              + Agregar Empleado
            </a>
          </div>

          {employees.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No hay empleados aún. Agrega el primero.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Rol</th>
                  <th className="px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => {
                  const isActive = activeEntries.some((e) => e.userId === emp.id);
                  return (
                    <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{emp.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{emp.role}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {isActive ? "Registrado" : "Fuera"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}