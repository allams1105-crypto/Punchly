import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";


export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  // 1. Verificación de sesión
  if (!session || !session.user) {
    redirect("/es/login");
  }

  const user = session.user as any;
  const role = user.role;
  const orgId = user.organizationId;

  // 2. Verificación de permisos
  if (role !== "OWNER" && role !== "ADMIN") {
    redirect("/es/employee/dashboard");
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
  const trialDays = 14;
  const daysLeft = Math.max(0, trialDays - daysSince);
  const trialExpired = daysSince >= trialDays;
  const isPro = !!(org as any).isPro;

  // 5. Trial expired — hard block
  if (trialExpired && !isPro) {
    redirect("/es/paywall");
  }

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <style>{`
        @media (max-width: 768px) {
          .punchly-sidebar { display: none !important; }
          .punchly-mobile-nav { display: flex !important; }
          .admin-main-content { padding-bottom: 80px !important; }
        }
      `}</style>
      <Sidebar orgName={org.name || "Mi Empresa"} />
      <div className="flex-1 flex flex-col overflow-hidden pt-4 md:pt-0 admin-main-content">
        {trialExpired && !isPro ? (
          <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(255,255,255,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backdropFilter:"blur(20px)"}}>
            <div style={{textAlign:"center",maxWidth:"400px",padding:"40px",background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"24px",boxShadow:"0 10px 40px rgba(0,0,0,0.05)"}}>
              <div style={{width:"56px",height:"56px",borderRadius:"16px",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",boxShadow:"0 0 40px rgba(59, 130, 246,0.3)"}}>
                <span style={{color:"white",fontWeight:900,fontSize:"22px",fontFamily:"var(--font-inter)"}}>P</span>
              </div>
              <h2 style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"24px",color:"var(--text-primary)",marginBottom:"12px"}}>Tu prueba ha terminado</h2>
              <p style={{color:"var(--text-muted)",fontSize:"14px",lineHeight:1.7,fontFamily:"var(--font-inter)",marginBottom:"28px"}}>
                Tu periodo de prueba de 14 días ha finalizado. Por favor contacta a un asesor para activar tu plan y continuar utilizando la plataforma sin interrupciones.
              </p>
              <a href="https://wa.me/18098686257?text=Hola,%20mi%20cuenta%20de%20Punchly%20ha%20expirado%20y%20me%20gustar%C3%ADa%20activarla" target="_blank" rel="noopener noreferrer" style={{display:"block",background:"var(--accent)",color:"white",padding:"16px 32px",borderRadius:"16px",fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"15px",textDecoration:"none",boxShadow:"0 0 40px rgba(59, 130, 246,0.3)"}}>
                Contactar a un agente
              </a>
              <p style={{color:"var(--text-muted)",fontSize:"11px",marginTop:"12px",fontFamily:"var(--font-inter)"}}>Renovación mensual · Facturación local</p>
            </div>
          </div>
        ) : children}
      </div>
      {/* Mobile bottom nav */}
      <nav className="punchly-mobile-nav" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"var(--bg-card)",borderTop:"1px solid var(--border)",padding:"12px 8px 24px",display:"none",alignItems:"center",justifyContent:"space-around"}}>
        <a href="/es/admin/dashboard" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",textDecoration:"none",color:"var(--text-muted)",fontSize:"11px",fontFamily:"var(--font-inter)"}}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Inicio
        </a>
        <a href="/es/admin/employees" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",textDecoration:"none",color:"var(--text-muted)",fontSize:"11px",fontFamily:"var(--font-inter)"}}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          Equipo
        </a>
        <a href="/es/admin/attendance" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",textDecoration:"none",color:"var(--text-muted)",fontSize:"11px",fontFamily:"var(--font-inter)"}}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          Asistencia
        </a>
        <a href="/es/admin/settings" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",textDecoration:"none",color:"var(--text-muted)",fontSize:"11px",fontFamily:"var(--font-inter)"}}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Ajustes
        </a>
      </nav>
    </div>
  );
}