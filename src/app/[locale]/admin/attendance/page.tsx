"use client";
import { useLang } from "@/lib/LangContext";
import { useEffect, useState } from "react";

export default function AttendancePage() {
  const { lang } = useLang();
  const [data, setData] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [days, setDays] = useState("30");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/attendance?days="+days).then(r=>r.json()),
      fetch("/api/employees").then(r=>r.json()),
    ]).then(([a,e]) => {
      setData(a.entries||a||[]);
      setEmployees(e.employees||[]);
      setLoading(false);
    });
  }, [days]);

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
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(csv); a.download = "asistencia.csv"; a.click();
  }

  const inputStyle = {background:card,border:"1px solid "+border,borderRadius:"12px",padding:"9px 14px",color:text,fontSize:"13px",fontFamily:"var(--font-dm-sans)",transition:"border 0.2s"};

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
        <div>
          <h1 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:text}}>{lang==="es"?"Asistencia":"Attendance"}</h1>
          <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:muted}}>{filtered.length} registros</p>
        </div>
        <button onClick={exportCSV} className="btn-gold" style={{padding:"8px 16px",borderRadius:"12px",fontSize:"12px"}}>
          {lang==="es"?"Exportar CSV":"Export CSV"}
        </button>
      </div>

      <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:"14px"}}>
        <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}} className="stack-mobile">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={lang==="es"?"Buscar empleado...":"Search employee..."} style={inputStyle} className="full-mobile" />
          <select value={days} onChange={e=>setDays(e.target.value)} style={inputStyle}>
            <option value="7">7 días</option>
            <option value="15">15 días</option>
            <option value="30">30 días</option>
            <option value="90">90 días</option>
          </select>
        </div>

        <div style={{background:card,backdropFilter:"blur(20px)",border:"1px solid "+border,borderRadius:"20px",overflow:"hidden"}}>
          {loading ? (
            <div style={{padding:"48px",textAlign:"center"}}>
              <p style={{color:muted,fontFamily:"var(--font-dm-sans)",fontSize:"13px"}}>Cargando...</p>
            </div>
          ) : filtered.length===0 ? (
            <div style={{padding:"48px",textAlign:"center"}}>
              <p style={{color:muted,fontFamily:"var(--font-dm-sans)",fontSize:"13px"}}>Sin registros</p>
            </div>
          ) : (
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 120px 100px 100px 80px",padding:"10px 20px",borderBottom:"1px solid "+border}} className="hide-mobile">
                {["Empleado","Fecha","Entrada","Salida","Horas"].map(h=>(
                  <p key={h} style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",fontWeight:600,color:muted,textTransform:"uppercase",letterSpacing:"1px"}}>{h}</p>
                ))}
              </div>
              {filtered.map(e => {
                const ci = new Date(e.clockIn);
                const co = e.clockOut ? new Date(e.clockOut) : null;
                const h = Math.floor((e.durationMin||0)/60);
                const m = (e.durationMin||0)%60;
                return (
                  <div key={e.id} className="row-hover" style={{display:"grid",gridTemplateColumns:"1fr 120px 100px 100px 80px",padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.04)",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                      <div style={{width:"32px",height:"32px",borderRadius:"10px",background:gold+"15",border:"1px solid "+gold+"25",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-syne)",fontWeight:700,color:gold,fontSize:"12px",flexShrink:0}}>
                        {(e.user?.name||e.userName||"?").charAt(0)}
                      </div>
                      <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"13px",color:text,fontWeight:500}}>{e.user?.name||e.userName}</p>
                    </div>
                    <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"12px",color:muted}}>{ci.toLocaleDateString("es",{day:"numeric",month:"short"})}</p>
                    <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"12px",color:"#34D399"}}>{ci.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}</p>
                    <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"12px",color:co?"#60A5FA":muted}}>{co?co.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}):"—"}</p>
                    <p style={{fontFamily:"var(--font-syne)",fontSize:"12px",fontWeight:700,color:e.durationMin?gold:muted}}>{e.durationMin?`${h}h${m>0?" "+m+"m":""}`:"—"}</p>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}