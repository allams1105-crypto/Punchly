"use client";
import { useLang } from "@/lib/LangContext";
import { useEffect, useState } from "react";

type Entry = { id:string; userId:string; clockIn:string; clockOut:string|null; durationMin:number|null; status:string; user:{name:string} };
type Employee = { id:string; name:string };
type Log = { id:string; action:string; userName:string; details:string; createdAt:string };

export default function ActivityPage() {
  const { lang } = useLang();
  const [tab, setTab] = useState<"entries"|"logs">("entries");
  const [logs, setLogs] = useState<Log[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState("");
  const [modal, setModal] = useState<"edit"|"create"|"delete"|null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry|null>(null);
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [saving, setSaving] = useState(false);
  const [formUserId, setFormUserId] = useState("");
  const [formClockIn, setFormClockIn] = useState("");
  const [formClockOut, setFormClockOut] = useState("");

  useEffect(()=>{
    fetch("/api/employees").then(r=>r.json()).then(d=>setEmployees(d.employees||[]));
  },[]);

  useEffect(()=>{
    setLoading(true);
    if(tab==="logs"){
      fetch("/api/activity").then(r=>r.json()).then(d=>{setLogs(d.logs||[]);setLoading(false);});
    } else {
      const url = selectedUser?"/api/time-entries?userId="+selectedUser:"/api/time-entries";
      fetch(url).then(r=>r.json()).then(d=>{setEntries(d.entries||[]);setLoading(false);});
    }
  },[tab,selectedUser]);

  function toLocalInput(iso:string){const d=new Date(iso);const p=(n:number)=>String(n).padStart(2,"0");return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;}

  function openCreate(){
    setFormUserId(employees[0]?.id||"");
    setFormClockIn(toLocalInput(new Date().toISOString()));
    setFormClockOut(""); setPassword(""); setPassError(""); setModal("create");
  }

  async function handleSave(){
    setSaving(true); setPassError("");
    const body:any={password};
    if(modal==="edit"){body.action="update";body.entryId=selectedEntry?.id;body.clockIn=new Date(formClockIn).toISOString();body.clockOut=formClockOut?new Date(formClockOut).toISOString():null;}
    else if(modal==="create"){body.action="create";body.userId=formUserId;body.clockIn=new Date(formClockIn).toISOString();body.clockOut=formClockOut?new Date(formClockOut).toISOString():null;}
    else if(modal==="delete"){body.action="delete";body.entryId=selectedEntry?.id;}
    const res=await fetch("/api/time-entries/edit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    const d=await res.json();
    if(!res.ok){setPassError(d.error||"Error");setSaving(false);return;}
    fetch(selectedUser?"/api/time-entries?userId="+selectedUser:"/api/time-entries").then(r=>r.json()).then(d=>setEntries(d.entries||[]));
    setModal(null); setSaving(false);
  }

  const actionColors:Record<string,string> = {CLOCK_IN:"#34D399",CLOCK_OUT:"#60A5FA",LATE:"#F87171",ABSENT:"#F87171",EMPLOYEE_CREATED:"#C9A84C",EMPLOYEE_UPDATED:"#A78BFA"};

  const inputStyle = {width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"10px 14px",color:"#FAFAFA",fontSize:"13px",fontFamily:"var(--font-dm-sans)",transition:"border 0.2s",boxSizing:"border-box" as const};

  return (
    <div style={{flex:1,overflowY:"auto",background:bg}}>
      <style>{`
  .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
  .btn-gold{background:linear-gradient(135deg,#C9A84C,#F0D080);color:#000;font-family:var(--font-syne);font-weight:700;border:none;cursor:pointer;transition:all 0.3s ease}
  .btn-gold:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(201,168,76,0.3)}
  .row-hover{transition:background 0.15s ease}
  .row-hover:hover{background:rgba(255,255,255,0.04)!important}
  input,select,textarea{color-scheme:dark}
  input:focus,select:focus{border:1px solid rgba(201,168,76,0.4)!important;outline:none}
  @media(max-width:768px){.hide-mobile{display:none!important}.stack-mobile{flex-direction:column!important}.full-mobile{width:100%!important}.grid-mobile-1{grid-template-columns:1fr!important}}
`}</style>
      <div style={{height:"56px",borderBottom:"1px solid "+border,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:text}}>Actividad</h1>
        {tab==="entries" && (
          <button onClick={openCreate} className="btn-gold" style={{padding:"8px 16px",borderRadius:"12px",fontSize:"12px"}}>+ Registro</button>
        )}
      </div>

      <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:"14px"}}>
        <div style={{display:"flex",gap:"4px",background:card,border:"1px solid "+border,borderRadius:"12px",padding:"4px",width:"fit-content"}}>
          {([["entries","Registros"],["logs","Eventos"]] as const).map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)}
              style={{padding:"8px 16px",borderRadius:"10px",fontSize:"12px",fontFamily:"var(--font-dm-sans)",fontWeight:tab===k?600:400,border:"none",cursor:"pointer",transition:"all 0.15s",
                background:tab===k?"linear-gradient(135deg,#C9A84C,#F0D080)":"transparent",color:tab===k?"#000":muted}}>
              {l}
            </button>
          ))}
        </div>

        {tab==="entries" && (
          <select value={selectedUser} onChange={e=>setSelectedUser(e.target.value)}
            style={{background:card,border:"1px solid "+border,borderRadius:"12px",padding:"9px 14px",color:text,fontSize:"13px",fontFamily:"var(--font-dm-sans)",width:"220px"}}>
            <option value="">Todos los empleados</option>
            {employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        )}

        <div style={{background:card,backdropFilter:"blur(20px)",border:"1px solid "+border,borderRadius:"20px",overflow:"hidden"}}>
          {loading ? <div style={{padding:"48px",textAlign:"center"}}><p style={{color:muted,fontFamily:"var(--font-dm-sans)",fontSize:"13px"}}>Cargando...</p></div>
          : tab==="logs" ? (
            logs.length===0 ? <div style={{padding:"48px",textAlign:"center"}}><p style={{color:muted,fontFamily:"var(--font-dm-sans)",fontSize:"13px"}}>Sin actividad</p></div>
            : logs.map(log=>{
              const c = actionColors[log.action]||muted;
              return (
                <div key={log.id} className="row-hover" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                    <span style={{fontSize:"11px",padding:"3px 10px",borderRadius:"100px",fontFamily:"var(--font-dm-sans)",fontWeight:600,background:c+"15",color:c,border:"1px solid "+c+"25",flexShrink:0}}>{log.action.replace("_"," ")}</span>
                    <div>
                      <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"13px",color:text,fontWeight:500}}>{log.userName}</p>
                      {log.details && <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:muted,marginTop:"2px"}}>{log.details}</p>}
                    </div>
                  </div>
                  <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:muted,flexShrink:0,marginLeft:"12px"}}>{new Date(log.createdAt).toLocaleDateString("es",{day:"numeric",month:"short"})} {new Date(log.createdAt).toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}</p>
                </div>
              );
            })
          ) : (
            entries.length===0 ? <div style={{padding:"48px",textAlign:"center"}}><p style={{color:muted,fontFamily:"var(--font-dm-sans)",fontSize:"13px"}}>Sin registros</p></div>
            : entries.map(e=>{
              const ci=new Date(e.clockIn); const co=e.clockOut?new Date(e.clockOut):null;
              const h=Math.floor((e.durationMin||0)/60); const m=(e.durationMin||0)%60;
              return (
                <div key={e.id} className="row-hover" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <div style={{width:"32px",height:"32px",borderRadius:"10px",background:gold+"15",border:"1px solid "+gold+"25",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-syne)",fontWeight:700,color:gold,fontSize:"12px",flexShrink:0}}>
                      {(e.user?.name||"?").charAt(0)}
                    </div>
                    <div>
                      <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"13px",color:text,fontWeight:500}}>{e.user?.name}</p>
                      <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:muted,marginTop:"2px"}}>
                        {ci.toLocaleDateString("es",{day:"numeric",month:"short"})} · {ci.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
                        {co && ` — ${co.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}`}
                      </p>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                    <p style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"13px",color:e.durationMin?gold:muted}}>{e.durationMin?`${h}h ${m>0?m+"m":""}`:"—"}</p>
                    <button onClick={()=>{setSelectedEntry(e);setFormClockIn(toLocalInput(e.clockIn));setFormClockOut(e.clockOut?toLocalInput(e.clockOut):"");setPassword("");setPassError("");setModal("edit");}}
                      style={{background:"transparent",border:"none",cursor:"pointer",color:muted,padding:"6px",borderRadius:"8px",transition:"all 0.15s"}}
                      onMouseEnter={el=>(el.currentTarget.style.color=gold)} onMouseLeave={el=>(el.currentTarget.style.color=muted)}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={()=>{setSelectedEntry(e);setPassword("");setPassError("");setModal("delete");}}
                      style={{background:"transparent",border:"none",cursor:"pointer",color:muted,padding:"6px",borderRadius:"8px",transition:"all 0.15s"}}
                      onMouseEnter={el=>(el.currentTarget.style.color="#F87171")} onMouseLeave={el=>(el.currentTarget.style.color=muted)}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:"20px"}}>
          <div style={{background:"#111",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"24px",padding:"28px",width:"100%",maxWidth:"420px",boxShadow:"0 40px 80px rgba(0,0,0,0.6)"}}>
            <h2 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"16px",color:text,marginBottom:"6px"}}>
              {modal==="edit"?"Editar registro":modal==="create"?"Agregar registro":"Eliminar registro"}
            </h2>
            <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"12px",color:muted,marginBottom:"20px"}}>
              {modal==="delete"?"Esta acción no se puede deshacer.":"Los cambios quedan en el log de actividad."}
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:"12px",marginBottom:"16px"}}>
              {modal==="create" && (
                <div>
                  <label style={{display:"block",fontSize:"11px",color:muted,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"}}>Empleado</label>
                  <select value={formUserId} onChange={e=>setFormUserId(e.target.value)} style={inputStyle}>
                    {employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
              )}
              {modal!=="delete" && (
                <>
                  <div>
                    <label style={{display:"block",fontSize:"11px",color:muted,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"}}>Hora de entrada</label>
                    <input type="datetime-local" value={formClockIn} onChange={e=>setFormClockIn(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:"11px",color:muted,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"}}>Hora de salida (opcional)</label>
                    <input type="datetime-local" value={formClockOut} onChange={e=>setFormClockOut(e.target.value)} style={inputStyle} />
                  </div>
                </>
              )}
              <div>
                <label style={{display:"block",fontSize:"11px",color:muted,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"}}>Contraseña admin</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" style={inputStyle} />
                {passError && <p style={{color:"#F87171",fontSize:"12px",marginTop:"6px",fontFamily:"var(--font-dm-sans)"}}>{passError}</p>}
              </div>
            </div>
            <div style={{display:"flex",gap:"10px"}}>
              <button onClick={()=>setModal(null)} style={{flex:1,padding:"12px",borderRadius:"12px",border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:muted,fontSize:"13px",fontFamily:"var(--font-dm-sans)",cursor:"pointer"}}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn-gold"
                style={{flex:1,padding:"12px",borderRadius:"12px",fontSize:"13px",opacity:saving?0.6:1,
                  background:modal==="delete"?"#F87171":"linear-gradient(135deg,#C9A84C,#F0D080)",
                  color:modal==="delete"?"white":"#000"}}>
                {saving?"Guardando...":modal==="delete"?"Eliminar":"Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}