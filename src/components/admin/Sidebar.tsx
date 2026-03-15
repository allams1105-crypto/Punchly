"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href:"/en/admin/dashboard", label:"Dashboard", icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href:"/en/admin/employees", label:"Empleados", icon:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { href:"/en/admin/employees/new", label:"Nuevo empleado", icon:"M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
  { href:"/en/admin/attendance", label:"Asistencia", icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href:"/en/admin/payroll", label:"Nómina", icon:"M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
  { href:"/en/admin/activity", label:"Actividad", icon:"M13 10V3L4 14h7v7l9-11h-7z" },
  { href:"/en/admin/kiosk", label:"Kiosk", icon:"M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { href:"/en/admin/settings", label:"Configuración", icon:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function Sidebar({ orgName }: { orgName?: string }) {
  const path = usePathname();
  const gold = "#D4AF37"; // El nuevo dorado premium

  // Handler para asegurar que el logout se ejecute correctamente
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/en" });
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback manual si NextAuth falla
      window.location.href = "/en";
    }
  };
  
  return (
    <div className="punchly-sidebar" style={{width:"220px",minHeight:"100vh",background:"rgba(255,255,255,0.01)",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",flexShrink:0}}>
      {/* Logo */}
      <div style={{padding:"20px 16px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"4px"}}>
          <div style={{width:"32px",height:"32px",borderRadius:"10px",background:`linear-gradient(135deg, ${gold}, #8B6914)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0, boxShadow: `0 0 15px ${gold}33`}}>
            <span style={{color:"#000",fontWeight:900,fontSize:"14px",fontFamily:"var(--font-syne)"}}>P</span>
          </div>
          <span style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Punchly.Clock</span>
        </div>
        {orgName && <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(255,255,255,0.25)",paddingLeft:"42px"}}>{orgName}</p>}
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:"12px 8px",overflowY:"auto"}}>
        <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"10px",fontWeight:600,color:"rgba(255,255,255,0.15)",textTransform:"uppercase",letterSpacing:"1.5px",padding:"4px 8px 8px"}}>Menu</p>
        {links.map(l=>{
          const isExact = path === l.href;
          const isSubPath = path.startsWith(l.href + "/") && !path.startsWith(l.href + "/new");
          const active = l.href.endsWith("/new") ? isExact : (isExact || isSubPath);

          return (
            <Link key={l.href} href={l.href}
              style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 10px",borderRadius:"12px",textDecoration:"none",marginBottom:"2px",
                background:active?`${gold}15`:"transparent",
                border:active?`1px solid ${gold}33`:"1px solid transparent",
                color:active?gold:"rgba(255,255,255,0.4)",
                fontSize:"13px",fontFamily:"var(--font-dm-sans)",fontWeight:active?600:400,
                transition:"all 0.15s ease"}}>
              <svg style={{width:"15px",height:"15px",flexShrink:0}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={l.icon}/>
              </svg>
              {l.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{padding:"12px 8px 16px",borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", gap:"8px"}}>
        {/* Cambiador de Idioma */}
        <div style={{marginBottom:"4px"}}>
          
        </div>
        
        {/* Botón Logout arreglado */}
        <button 
          onClick={handleLogout}
          style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 10px",borderRadius:"12px",width:"100%",border:"none",background:"transparent",color:"rgba(255,255,255,0.3)",fontSize:"13px",fontFamily:"var(--font-dm-sans)",cursor:"pointer",transition:"all 0.15s"}}>
          <svg style={{width:"15px",height:"15px"}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}