"use client";
import { useState } from "react";
import Link from "next/link";

const COLORS = ["#C9A84C","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80"];

function Avatar({ name, color }: { name: string; color?: string | null }) {
  // Aseguramos que el componente Avatar tenga las variables globales por si acaso
  const bg = color || COLORS[(name?.charCodeAt(0)||0) % COLORS.length];
  
  return (
    <div style={{width:"44px",height:"44px",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"16px",flexShrink:0,background:bg+"15",border:"1.5px solid "+bg+"25",color:bg}}>
      {(name||"?").charAt(0).toUpperCase()}
    </div>
  );
}

export default function EmployeesClient({ employees }: { employees: any[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Colores para TypeScript
  const bg = "var(--bg-primary, #0A0A0A)";
  const card = "var(--bg-card, #111111)";
  const border = "var(--border, rgba(255,255,255,0.08))";
  const text = "var(--text-primary, #FAFAFA)";
  const muted = "var(--text-muted, #A1A1AA)";
  const gold = "#C9A84C";

  const filtered = (employees||[]).filter(e => {
    const q = (search||"").toLowerCase();
    const match = (e.name||"").toLowerCase().includes(q) || (e.email||"").toLowerCase().includes(q);
    const f = filter==="all" ? true : filter==="active" ? e.isActive : filter==="inactive" ? !e.isActive : filter==="onshift" ? e.onShift : !e.hasSchedule;
    return match && f;
  });

  const stats = [
    {label:"Total",value:(employees||[]).length,color:text},
    {label:"En turno",value:(employees||[]).filter(e=>e.onShift).length,color:"#34D399"},
    {label:"Activos",value:(employees||[]).filter(e=>e.isActive).length,color:gold},
    {label:"Sin horario",value:(employees||[]).filter(e=>!e.hasSchedule).length,color:"#FB923C"},
  ];

  return (
    <div style={{flex:1,overflowY:"auto",background:bg,backgroundImage:"radial-gradient(ellipse at 20% 0%, rgba(201,168,76,0.04) 0%, transparent 50%)"}}>
      <style>{`
  .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
  .glass-gold{background:rgba(201,168,76,0.08);backdrop-filter:blur(20px);border:1px solid rgba(201,168,76,0.2)}
  .gold-text{background:linear-gradient(135deg,#C9A84C,#F0D080);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .btn-gold{background:linear-gradient(135deg,#C9A84C,#F0D080);color:#000;font-family:var(--font-syne);font-weight:700;border:none;cursor:pointer;transition:all 0.3s ease}
  .btn-gold:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(201,168,76,0.3)}
  .row-hover{transition:background 0.15s ease}
  .row-hover:hover{background:rgba(255,255,255,0.04)!important}
  .card-hover{transition:all 0.25s ease}
  .card-hover:hover{transform:translateY(-2px);border-color:rgba(201,168,76,0.2)!important}
  input,select{color-scheme:dark}
  input:focus,select:focus{border:1px solid rgba(201,168,76,0.4)!important;outline:none}
  @media(max-width:768px){.hide-mobile{display:none!important}.stack-mobile{flex-direction:column!important}.full-mobile{width:100%!important}.grid-mobile-1{grid-template-columns:1fr!important}.grid-mobile-2{grid-template-columns:1fr 1fr!important}}
`}</style>
      <div style={{height:"56px",borderBottom:"1px solid "+border,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:text}}>Empleados</h1>
          <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:muted}}>{(employees||[]).length} en total</p>
        </div>
        <Link href="/en/admin/employees/new" className="btn-gold" style={{padding:"8px 16px",borderRadius:"12px",fontSize:"12px",textDecoration:"none",display:"inline-block"}}>+ Nuevo</Link>
      </div>

      <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:"16px"}}>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"}} className="grid-mobile-2">
          {stats.map((s, idx)=>(
            <div key={idx} className="glass" style={{borderRadius:"16px",padding:"16px",textAlign:"center"}}>
              <p style={{fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"24px",color:s.color}}>{s.value}</p>
              <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:muted,marginTop:"4px"}}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center"}} className="stack-mobile">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..."
            style={{background:card,border:"1px solid "+border,borderRadius:"12px",padding:"9px 14px",color:text,fontSize:"13px",fontFamily:"var(--font-dm-sans)",width:"200px",transition:"border 0.2s"}} />
          <div style={{display:"flex",background:card,border:"1px solid "+border,borderRadius:"12px",overflow:"hidden"}}>
            {[["all","Todos"],["active","Activos"],["inactive","Inactivos"],["onshift","En turno"]].map(([k,l])=>(
              <button key={k} onClick={()=>setFilter(k)}
                style={{padding:"9px 14px",fontSize:"12px",fontFamily:"var(--font-dm-sans)",fontWeight:filter===k?600:400,border:"none",cursor:"pointer",transition:"all 0.15s",
                  background:filter===k?"linear-gradient(135deg,#C9A84C,#F0D080)":"transparent",color:filter===k?"#000":muted}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length===0 ? (
          <div className="glass" style={{borderRadius:"20px",padding:"48px",textAlign:"center"}}>
            <p style={{color:muted,fontSize:"13px",fontFamily:"var(--font-dm-sans)"}}>No hay empleados</p>
            <Link href="/en/admin/employees/new" className="btn-gold" style={{display:"inline-block",padding:"10px 20px",borderRadius:"12px",fontSize:"13px",textDecoration:"none",marginTop:"16px"}}>+ Agregar primero</Link>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}} className="grid-mobile-1">
            {filtered.map(emp=>(
              <Link key={emp.id} href={"/en/admin/employees/"+emp.id} style={{textDecoration:"none"}}>
                <div className="glass card-hover" style={{borderRadius:"20px",padding:"20px",cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"14px"}}>
                    <Avatar name={emp.name} color={emp.avatarColor} />
                    <div style={{display:"flex",flexDirection:"column",gap:"4px",alignItems:"flex-end"}}>
                      {emp.onShift && <span style={{fontSize:"10px",color:"#34D399",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",padding:"3px 8px",borderRadius:"100px",fontFamily:"var(--font-dm-sans)"}}>En turno</span>}
                      {!emp.isActive && <span style={{fontSize:"10px",color:muted,background:card,border:"1px solid "+border,padding:"3px 8px",borderRadius:"100px",fontFamily:"var(--font-dm-sans)"}}>Inactivo</span>}
                    </div>
                  </div>
                  <p style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:text}}>{emp.name}</p>
                  <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"12px",color:muted,marginTop:"2px"}}>{emp.email}</p>
                  <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(201,168,76,0.6)",marginTop:"8px"}}>${emp.hourlyRate||0}/h</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}