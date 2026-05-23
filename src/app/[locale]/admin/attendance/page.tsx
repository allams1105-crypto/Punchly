"use client";
import { useLang } from "@/lib/LangContext";
import { useEffect, useState } from "react";

const COLORS = ["var(--accent)","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80"];

function Avatar({ name, color, photoUrl }: { name: string; color?: string | null; photoUrl?: string | null }) {
  const bg = color || COLORS[(name?.charCodeAt(0)||0) % COLORS.length];
  if (photoUrl) {
    return <img src={photoUrl} alt={name} style={{width:"36px",height:"36px",borderRadius:"12px",objectFit:"cover",flexShrink:0,border:`1px solid rgba(255,255,255,0.1)`}} />;
  }
  return (
    <div style={{width:"36px",height:"36px",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:700,fontFamily:"var(--font-inter)",flexShrink:0,background:`${bg}15`,border:`1px solid ${bg}25`,color:bg}}>
      {(name||"?").charAt(0).toUpperCase()}
    </div>
  );
}

export default function AttendancePage() {
  const { lang } = useLang();
  const [data, setData] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [editClockIn, setEditClockIn] = useState("");
  const [editClockOut, setEditClockOut] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  
  // Default to last 7 days
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const bg = "var(--bg-primary, #0A0A0A)";
  const card = "var(--bg-card, rgba(255,255,255,0.02))";
  const border = "var(--border, rgba(255,255,255,0.06))";
  const text = "var(--text-primary, #FAFAFA)";
  const muted = "var(--text-muted, #A1A1AA)";
  const primary = "var(--accent)";

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/attendance?start=${startDate}&end=${endDate}`).then(r=>r.json()),
      fetch("/api/employees").then(r=>r.json()),
    ]).then(([a,e]) => {
      setData(a.entries||a||[]);
      setEmployees(e.employees||[]);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const handleEditClick = (entry: any) => {
    setEditingEntry(entry);
    
    // Adjust to local datetime format for datetime-local input
    const toLocalDatetime = (d: string) => {
      if (!d) return "";
      const date = new Date(d);
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };

    setEditClockIn(toLocalDatetime(entry.clockIn));
    setEditClockOut(entry.clockOut ? toLocalDatetime(entry.clockOut) : "");
    setAdminPassword("");
    setEditError("");
  };

  const handleSaveEdit = async () => {
    setEditError("");
    setEditLoading(true);
    try {
      const res = await fetch("/api/attendance/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeEntryId: editingEntry.id,
          newClockIn: new Date(editClockIn).toISOString(),
          newClockOut: editClockOut ? new Date(editClockOut).toISOString() : null,
          adminPassword
        })
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Error al guardar");
      
      setEditingEntry(null);
      loadData();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const filtered = data.filter(e =>
    (e.userName||e.user?.name||"").toLowerCase().includes((search||"").toLowerCase())
  );

  function exportCSV() {
    const rows = [["Empleado","Fecha","Entrada","Salida","Horas","Estado"]];
    filtered.forEach(e => {
      const ci = new Date(e.clockIn);
      const co = e.clockOut ? new Date(e.clockOut) : null;
      const h = e.durationMin ? (e.durationMin/60).toFixed(1) : "-";
      rows.push([e.user?.name||e.userName||"",ci.toLocaleDateString("es"),ci.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}),co?co.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}):"-",h,e.status||""]);
    });
    const csv = rows.map(r=>r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(csv); a.download = `asistencia_${startDate}_${endDate}.csv`; a.click();
  }

  const inputStyle: React.CSSProperties = {background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"12px 16px",color:text,fontSize:"14px",fontFamily:"var(--font-inter)",transition:"border 0.2s",outline:"none"};
  const labelStyle: React.CSSProperties = {fontSize:"10px",fontWeight:700,color:muted,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"6px",display:"block",fontFamily:"var(--font-inter)"};

  return (
    <div style={{flex:1,overflowY:"auto",background:bg,position:"relative"}}>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; opacity: 0.6; transition: 0.2s; }
        input[type="date"]::-webkit-calendar-picker-indicator:hover { opacity: 1; }
        input:focus { border-color: var(--accent) !important; }
        .glass-panel { background: rgba(255,255,255,0.02); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden; }
        .btn-primary { background: linear-gradient(135deg,var(--accent),var(--accent-dark)); color: #000; font-family: var(--font-inter); font-weight: 700; padding: 12px 24px; border-radius: 14px; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(59,130,246,0.2); display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary:hover { transform: translateY(-1px) scale(1.02); box-shadow: 0 8px 25px rgba(59,130,246,0.3); }
        .row-item { display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 40px; padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.03); align-items: center; transition: all 0.2s; }
        .row-item:hover { background: rgba(255,255,255,0.04); }
        .col-header { font-family: var(--font-inter); font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1.5px; }
        
        @media(max-width:768px) {
          .mobile-stack { flex-direction: column !important; align-items: stretch !important; }
          .mobile-full { width: 100% !important; }
          .row-item { display: flex !important; flex-direction: column !important; align-items: flex-start !important; gap: 12px; padding: 20px !important; }
          .hide-mobile { display: none !important; }
          .mobile-flex-row { display: flex; width: 100%; justify-content: space-between; align-items: center; }
          .page-header { padding: 24px 20px 16px !important; flex-direction: column; align-items: stretch !important; gap: 16px; }
          .page-content { padding: 16px 20px 80px !important; }
        }
      `}</style>
      
      <div className="page-header" style={{padding:"32px 40px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",zIndex:10}}>
        <div>
          <h1 style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"28px",letterSpacing:"-1px",color:text}}>{lang==="es"?"Asistencia":"Attendance"}</h1>
          <p style={{fontFamily:"var(--font-inter)",fontSize:"14px",color:muted,marginTop:"4px",fontWeight:500}}>{filtered.length} registros encontrados</p>
        </div>
        <button onClick={exportCSV} className="btn-primary mobile-full">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          {lang==="es"?"Exportar Excel / CSV":"Export CSV"}
        </button>
      </div>

      <div className="page-content" style={{padding:"16px 40px 60px",display:"flex",flexDirection:"column",gap:"24px",maxWidth:"1600px",margin:"0 auto"}}>
        
        {/* Filters Panel */}
        <div className="glass-panel" style={{padding:"24px"}}>
          <div className="mobile-stack" style={{display:"flex",gap:"16px",alignItems:"flex-end"}}>
            <div style={{flex:1}} className="mobile-full">
              <label style={labelStyle}>{lang==="es"?"Buscar Empleado":"Search Employee"}</label>
              <div style={{position:"relative"}}>
                <svg style={{position:"absolute",left:"14px",top:"14px",color:"rgba(255,255,255,0.3)"}} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ej. Juan Pérez..." style={{...inputStyle, width:"100%", paddingLeft:"42px"}} />
              </div>
            </div>
            <div className="mobile-full">
              <label style={labelStyle}>{lang==="es"?"Desde":"From"}</label>
              <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{...inputStyle, width:"100%"}} />
            </div>
            <div className="mobile-full">
              <label style={labelStyle}>{lang==="es"?"Hasta":"To"}</label>
              <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={{...inputStyle, width:"100%"}} />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-panel">
          {loading ? (
            <div style={{padding:"60px",textAlign:"center"}}>
              <div style={{width:"40px",height:"40px",border:"3px solid rgba(59,130,246,0.1)",borderTopColor:"var(--accent)",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 16px"}}></div>
              <p style={{color:muted,fontFamily:"var(--font-inter)",fontSize:"14px",fontWeight:500}}>Cargando registros...</p>
            </div>
          ) : filtered.length===0 ? (
            <div style={{padding:"80px 20px",textAlign:"center"}}>
              <div style={{width:"56px",height:"56px",borderRadius:"50%",background:"rgba(255,255,255,0.03)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
                <svg width="24" height="24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <p style={{color:text,fontFamily:"var(--font-inter)",fontSize:"16px",fontWeight:600}}>No hay registros</p>
              <p style={{color:muted,fontFamily:"var(--font-inter)",fontSize:"13px",marginTop:"8px"}}>Intenta ajustar las fechas de tu calendario.</p>
            </div>
          ) : (
            <>
              <div className="row-item hide-mobile" style={{padding:"12px 24px",background:"rgba(0,0,0,0.2)",borderBottom:"1px solid "+border}}>
                <p className="col-header">Empleado</p>
                <p className="col-header">Fecha</p>
                <p className="col-header">Entrada</p>
                <p className="col-header">Salida</p>
                <p className="col-header" style={{textAlign:"right"}}>Horas</p>
                <p className="col-header"></p>
              </div>
              
              <div style={{display:"flex",flexDirection:"column"}}>
                {filtered.map(e => {
                  const ci = new Date(e.clockIn);
                  const co = e.clockOut ? new Date(e.clockOut) : null;
                  const h = Math.floor((e.durationMin||0)/60);
                  const m = (e.durationMin||0)%60;
                  const statusColor = e.status === "LATE" ? "#F87171" : "#34D399";
                  
                  return (
                    <div key={e.id} className="row-item">
                      {/* Employee Info */}
                      <div className="mobile-flex-row">
                        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                          <Avatar name={e.user?.name||e.userName} color={e.avatarColor} photoUrl={e.avatarUrl} />
                          <div>
                            <p style={{fontFamily:"var(--font-inter)",fontSize:"15px",color:text,fontWeight:600}}>{e.user?.name||e.userName}</p>
                            <span className="hide-desktop" style={{fontSize:"11px",color:statusColor,fontWeight:700,fontFamily:"var(--font-inter)",marginTop:"2px",display:"none"}}>{e.status === "LATE" ? "Tarde" : "A tiempo"}</span>
                          </div>
                        </div>
                        {/* Mobile right side - total hours */}
                        <div className="hide-desktop" style={{display:"none"}}>
                          <p style={{fontFamily:"var(--font-inter)",fontSize:"15px",fontWeight:800,color:e.durationMin?primary:muted,background:e.durationMin?"rgba(59,130,246,0.1)":"transparent",padding:"4px 10px",borderRadius:"8px"}}>{e.durationMin?`${h}h ${m}m`:"—"}</p>
                        </div>
                      </div>
                      
                      {/* Date */}
                      <div className="mobile-flex-row" style={{gap:"8px"}}>
                        <svg className="hide-desktop" style={{display:"none",width:"14px",color:muted}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <p style={{fontFamily:"var(--font-inter)",fontSize:"14px",color:muted,fontWeight:500}}>{ci.toLocaleDateString("es",{weekday:"short",day:"numeric",month:"short"})}</p>
                      </div>
                      
                      {/* Times */}
                      <div style={{display:"flex",alignItems:"center",gap:"8px"}} className="mobile-flex-row">
                        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                          <div style={{width:"6px",height:"6px",borderRadius:"50%",background:"#34D399"}} />
                          <p style={{fontFamily:"var(--font-inter)",fontSize:"14px",color:"#FAFAFA",fontWeight:600}}>{ci.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}</p>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:"8px"}} className="mobile-flex-row">
                        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                          <div style={{width:"6px",height:"6px",borderRadius:"50%",background:co?"#60A5FA":"rgba(255,255,255,0.1)"}} />
                          <p style={{fontFamily:"var(--font-inter)",fontSize:"14px",color:co?"#FAFAFA":muted,fontWeight:co?600:400}}>{co?co.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}):"Trabajando"}</p>
                        </div>
                      </div>
                      
                      {/* Hours (Desktop only, mobile shows at top) */}
                      <div className="hide-mobile" style={{textAlign:"right"}}>
                        <p style={{fontFamily:"var(--font-inter)",fontSize:"14px",fontWeight:700,color:e.durationMin?primary:muted}}>{e.durationMin?`${h}h ${m}m`:"—"}</p>
                        <p style={{fontSize:"11px",color:statusColor,fontWeight:600,fontFamily:"var(--font-inter)",marginTop:"4px"}}>{e.status === "LATE" ? "Llegó tarde" : "A tiempo"}</p>
                      </div>
                      
                      {/* Edit Button */}
                      <div style={{display:"flex",justifyContent:"flex-end",width:"100%"}}>
                        <button onClick={() => handleEditClick(e)} style={{background:"transparent",border:"none",color:muted,cursor:"pointer",padding:"8px"}} title="Editar registro">
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        </button>
                      </div>
                      
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        @media(max-width:768px) {
          .hide-desktop { display: block !important; }
        }
      `}</style>

      {/* Edit Modal */}
      {editingEntry && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(10px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
          <div style={{background:"#111",border:"1px solid "+border,borderRadius:"24px",padding:"32px",width:"100%",maxWidth:"400px"}}>
            <h3 style={{fontFamily:"var(--font-inter)",fontSize:"20px",fontWeight:700,color:text,marginBottom:"4px"}}>Editar Registro</h3>
            <p style={{color:muted,fontSize:"14px",fontFamily:"var(--font-inter)",marginBottom:"24px"}}>Editando a {editingEntry.userName||editingEntry.user?.name}</p>
            
            <div style={{display:"flex",flexDirection:"column",gap:"16px",marginBottom:"24px"}}>
              <div>
                <label style={labelStyle}>Hora de Entrada</label>
                <input type="datetime-local" value={editClockIn} onChange={e=>setEditClockIn(e.target.value)} style={{...inputStyle,width:"100%"}} />
              </div>
              <div>
                <label style={labelStyle}>Hora de Salida</label>
                <input type="datetime-local" value={editClockOut} onChange={e=>setEditClockOut(e.target.value)} style={{...inputStyle,width:"100%"}} />
              </div>
              <div style={{marginTop:"8px"}}>
                <label style={{...labelStyle,color:"#F87171"}}>Confirmar con PIN Admin</label>
                <input type="password" placeholder="Tu PIN numérico" value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} style={{...inputStyle,width:"100%",borderColor:"rgba(248,113,113,0.3)"}} />
              </div>
              {editError && <p style={{color:"#F87171",fontSize:"13px",fontFamily:"var(--font-inter)",marginTop:"-8px"}}>{editError}</p>}
            </div>
            
            <div style={{display:"flex",gap:"12px"}}>
              <button onClick={()=>setEditingEntry(null)} style={{flex:1,padding:"12px",background:"rgba(255,255,255,0.05)",color:text,border:"none",borderRadius:"14px",fontFamily:"var(--font-inter)",fontWeight:600,cursor:"pointer"}}>Cancelar</button>
              <button onClick={handleSaveEdit} disabled={editLoading} style={{flex:1,padding:"12px",background:primary,color:"#000",border:"none",borderRadius:"14px",fontFamily:"var(--font-inter)",fontWeight:700,cursor:"pointer",opacity:editLoading?0.5:1}}>
                {editLoading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}