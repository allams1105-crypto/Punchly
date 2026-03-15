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
      {/* Mobile bottom nav */}
    <nav className="punchly-mobile-nav" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(6,8,16,0.95)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.08)",padding:"8px 4px",display:"none",alignItems:"center",justifyContent:"space-around"}}>
      <a href="/en/admin/dashboard" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"6px 12px",borderRadius:"12px",textDecoration:"none",color:"rgba(255,255,255,0.4)",fontSize:"10px",fontFamily:"var(--font-dm-sans)"}}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        Dashboard
      </a>
      <a href="/en/admin/employees" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"6px 12px",borderRadius:"12px",textDecoration:"none",color:"rgba(255,255,255,0.4)",fontSize:"10px",fontFamily:"var(--font-dm-sans)"}}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        Empleados
      </a>
      <a href="/en/admin/attendance" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"6px 12px",borderRadius:"12px",textDecoration:"none",color:"rgba(255,255,255,0.4)",fontSize:"10px",fontFamily:"var(--font-dm-sans)"}}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        Asistencia
      </a>
      <a href="/en/admin/kiosk" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"6px 12px",borderRadius:"12px",textDecoration:"none",color:"rgba(255,255,255,0.4)",fontSize:"10px",fontFamily:"var(--font-dm-sans)"}}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
        Kiosk
      </a>
      <a href="/en/admin/settings" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"6px 12px",borderRadius:"12px",textDecoration:"none",color:"rgba(255,255,255,0.4)",fontSize:"10px",fontFamily:"var(--font-dm-sans)"}}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        Config
      </a>
    </nav>
  </div>
  );
}