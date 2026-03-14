import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import EmployeeEditClient from "@/components/admin/EmployeeEditClient";
import ScheduleEditor from "@/components/admin/ScheduleEditor";
import Link from "next/link";

export default async function EmployeePage({ params }: { params: any }) {
  const session = await auth();
  if (!session) redirect("/en/login");
  const orgId = (session.user as any).organizationId;
  const { id } = await params;

  const employee = await prisma.user.findUnique({
    where: { id, organizationId: orgId },
    include: { schedule: true },
  });
  if (!employee) notFound();

  const today = new Date(); today.setHours(0,0,0,0);
  const activeEntry = await prisma.timeEntry.findFirst({
    where: { userId: id, organizationId: orgId, clockOut: null, clockIn: { gte: today } },
  });

  return (
    <div style={{flex:1,overflowY:"auto",background:"#0A0A0A"}}>
      <style>{`
        @media(max-width:768px){.grid-mobile-1{grid-template-columns:1fr!important}}
        /* Arreglo del Hover con CSS en vez de JavaScript */
        .back-link { color: rgba(255,255,255,0.3); transition: color 0.15s; }
        .back-link:hover { color: #FAFAFA !important; }
      `}</style>
      
      <div style={{height:"56px",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"0 24px",display:"flex",alignItems:"center",gap:"12px"}}>
        <Link href="/en/admin/employees" className="back-link" style={{textDecoration:"none",fontSize:"13px",fontFamily:"var(--font-dm-sans)",display:"flex",alignItems:"center",gap:"6px"}}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Empleados
        </Link>
        <span style={{color:"rgba(255,255,255,0.15)"}}>·</span>
        <h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>{employee.name}</h1>
        {activeEntry && (
          <span style={{marginLeft:"auto",fontSize:"11px",color:"#34D399",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",padding:"4px 10px",borderRadius:"100px",fontFamily:"var(--font-dm-sans)"}}>En turno</span>
        )}
      </div>

      <div style={{padding:"24px",display:"grid",gridTemplateColumns:"1fr 360px",gap:"20px",alignItems:"start"}} className="grid-mobile-1">
        <EmployeeEditClient employee={{
          id: employee.id,
          name: employee.name,
          email: employee.email,
          hourlyRate: (employee as any).hourlyRate || 0,
          isActive: employee.isActive,
          avatarColor: (employee as any).avatarColor || null,
        }} />
        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
            <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:"#FAFAFA"}}>Horario</h3>
          </div>
          <div style={{padding:"20px"}}>
            <ScheduleEditor userId={employee.id} employeeName={employee?.name || 'Empleado'} />
          </div>
        </div>
      </div>
    </div>
  );
}