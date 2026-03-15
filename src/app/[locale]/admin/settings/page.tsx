import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/admin/SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/en/login");
  const orgId = (session.user as any).organizationId;
  const userId = (session.user as any).id;

  const [org, user] = await Promise.all([
    prisma.organization.findUnique({ where: { id: orgId } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  return (
    <div style={{flex:1,overflowY:"auto",background:"#0A0A0A"}}>
      <div style={{height:"56px",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"0 24px",display:"flex",alignItems:"center"}}>
        <h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Configuración</h1>
      </div>
      <div style={{padding:"24px",maxWidth:"640px"}}>
        <SettingsClient org={org} user={user} />
      </div>
    </div>
  );
}