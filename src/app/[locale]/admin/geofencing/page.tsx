import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import GeofencingClient from "@/components/admin/GeofencingClient";

export default async function GeofencingPage() {
  const session = await auth();
  if (!session) redirect("/en/login");
  const orgId = (session.user as any).organizationId;

  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  return (
    <div style={{flex:1,overflowY:"auto",background:"#0A0A0A",color:"#FAFAFA"}}>
      <div style={{height:"64px",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"0 32px",display:"flex",alignItems:"center"}}>
        <div>
          <h1 style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"16px",color:"#FAFAFA"}}>Ubicación y Geofencing</h1>
          <p style={{fontSize:"12px",color:"rgba(255,255,255,0.4)",marginTop:"4px",fontFamily:"var(--font-inter)"}}>Restringe desde dónde pueden fichar tus empleados</p>
        </div>
      </div>
      <div style={{padding:"32px",maxWidth:"700px"}}>
        <GeofencingClient org={org} />
      </div>
    </div>
  );
}
