import { prisma } from "@/lib/db";
import KioskClient from "@/components/kiosk/KioskClient";

export default async function KioskPage({ params }: { params: any }) {
  // 1. Forzamos la lectura del token sin que explote
  const p = await params;
  const token = p.token;

  if (!token) {
    return <div className="p-10 text-center font-bold">Error: No se proporcionó un token en la URL.</div>;
  }

  // 2. Buscamos la organización
  const org = await prisma.organization.findFirst({
    where: { OR: [{ id: token }, { slug: token }] },
  });

  // 3. SI NO ENCUENTRA LA ORG: En lugar de 404, mostramos qué token estamos recibiendo
  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-10 text-center">
        <h1 className="text-2xl font-black text-red-500 mb-4">Kiosko No Encontrado</h1>
        <p className="text-sm text-gray-400">El token <span className="text-yellow-500">"{token}"</span> no existe en la base de datos.</p>
        <p className="text-[10px] mt-4 text-gray-600">Verifica el ID de la organización en tu panel de control.</p>
      </div>
    );
  }

  const today = new Date(); 
  today.setHours(0,0,0,0);

  // 4. Cargamos empleados
  const [employees, activeEntries] = await Promise.all([
    prisma.user.findMany({
      where: { organizationId: org.id, isActive: true, role: { not: "OWNER" } },
      orderBy: { name: "asc" },
    }),
    prisma.timeEntry.findMany({
      where: { organizationId: org.id, clockOut: null, clockIn: { gte: today } },
    }),
  ]);

  const activeIds = new Set(activeEntries.map(e => e.userId));

  // 5. Renderizamos el cliente
  return (
    <KioskClient
      token={org.id}
      employees={employees.map(e => ({
        id: e.id,
        name: e.name || "Sin nombre",
        avatarColor: (e as any).avatarColor || null,
        onShift: activeIds.has(e.id),
        clockInTime: activeEntries.find(a => a.userId === e.id)?.clockIn?.toISOString() || null,
      }))}
    />
  );
}