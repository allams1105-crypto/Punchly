import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import TrialBanner from "@/components/admin/TrialBanner";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  // 1. Verificación de sesión
  if (!session || !session.user) {
    redirect("/en/login");
  }

  const user = session.user as any;
  const role = user.role;
  const orgId = user.organizationId;

  // 2. Verificación de permisos
  if (role !== "OWNER" && role !== "ADMIN") {
    redirect("/en/employee/dashboard");
  }

  // 3. Verificación de Organización
  if (!orgId) {
    // Si no hay orgId, algo falló en el registro. No podemos cargar la organización.
    return <div className="p-20 text-center">Error: No se encontró una organización vinculada a este usuario.</div>;
  }

  const org = await prisma.organization.findUnique({ 
    where: { id: orgId } 
  });

  // Si la organización no existe en la DB
  if (!org) {
    return <div className="p-20 text-center">Error: La organización no existe en la base de datos.</div>;
  }

  // 4. Lógica de Trial (Protegida contra nulos)
  const createdAt = org.createdAt ? new Date(org.createdAt) : new Date();
  const daysSince = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const trialDays = 7;
  const daysLeft = Math.max(0, trialDays - daysSince);
  const trialExpired = daysSince >= trialDays;
  const isPro = !!(org as any).isPro;

  // 5. Redirección de pago (Solo si no estamos ya en la página de pago)
  // Nota: Asegúrate de que /en/paywall NO use este mismo layout o entrarás en bucle.
  if (trialExpired && !isPro) {
    // redirect("/en/paywall"); // Comenta esta línea temporalmente para probar si carga el dashboard
  }

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      <Sidebar orgName={org.name || "Mi Empresa"} />
      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        {/* Pasamos daysLeft como número simple */}
        {!isPro && <TrialBanner daysLeft={daysLeft} />}
        {children}
      </div>
    </div>
  );
}