import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import TrialBanner from "@/components/admin/TrialBanner";
// Importamos el Enum directamente de Prisma para evitar errores de texto
import { SubscriptionStatus } from "@prisma/client";

export default async function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await auth();
  
  // 1. Validación de sesión y usuario
  if (!session?.user) redirect("/en/login");

  const user = session.user as any;
  const { role, organizationId: orgId } = user;

  // 2. Control de acceso
  if (role !== "OWNER" && role !== "ADMIN") {
    redirect("/en/employee/dashboard");
  }

  if (!orgId) redirect("/en/login");

  // 3. Consulta Única (Usando los nombres exactos de tu schema.prisma)
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      subscription: true, // "subscription" en singular según tu modelo
    },
  });

  if (!org) redirect("/en/login");

  // 4. Lógica de Trial y Suscripción
  const TRIAL_DAYS = 14;
  const createdAt = new Date(org.createdAt);
  const daysSinceCreation = Math.floor((Date.now() - createdAt.getTime()) / 86400000);
  
  const daysLeft = Math.max(0, TRIAL_DAYS - daysSinceCreation);
  const trialExpired = daysSinceCreation > TRIAL_DAYS;

  // Verificamos si el estado es ACTIVE usando el Enum de tu Prisma
  const isPro = org.subscription?.status === SubscriptionStatus.ACTIVE;

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      <Sidebar orgName={org.name || "Mi Empresa"} />
      
      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        {/* Banner: Se muestra si no es Pro */}
        {!isPro && (
          <TrialBanner 
            daysLeft={daysLeft} 
            expired={trialExpired} 
          />
        )}
        
        {/* Contenedor con scroll para los hijos */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}