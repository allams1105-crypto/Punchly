"use client";
import { useLang } from "@/lib/LangContext";
import { useEffect, useState } from "react";

export default function PayrollPage() {
  const { lang } = useLang();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("current");
  const [selected, setSelected] = useState<string[]>([]);
  const [sendingVouchers, setSendingVouchers] = useState(false);
  const [voucherMsg, setVoucherMsg] = useState("");
  const bg = "var(--bg-primary, #0A0A0A)";
  const card = "rgba(255,255,255,0.02)";
  const border = "rgba(255,255,255,0.06)";
  const text = "var(--text-primary, #FAFAFA)";
  const muted = "var(--text-muted, #A1A1AA)";
  const primary = "var(--accent)";

  // Modal State
  const [editing, setEditing] = useState<any>(null);
  const [editHours, setEditHours] = useState("");
  const [editPay, setEditPay] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const loadData = () => {
    setLoading(true);
    fetch("/api/payroll?period="+period).then(r=>r.json()).then(d=>{
      const empData = d.data || d.employees || d;
      setData(Array.isArray(empData) ? empData : []);
      setSelected([]);
      setLoading(false);
    }).catch(() => {
      setData([]);
      setSelected([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [period]);

  const total = Array.isArray(data) ? data.reduce((a,e)=>a+(e.totalPay||0),0) : 0;

  function exportCSV() {
    if (!Array.isArray(data)) return;
    const rows = [["Empleado","Horas","Extras","Tarifa","Total","Modificado Manualmente"]];
    data.forEach(e=>rows.push([e.name,e.totalHours?.toFixed(1)||0,e.overtimeHours?.toFixed(1)||0,e.hourlyRate||0,(e.totalPay||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),e.isOverridden?"Si":"No"]));
    const csv = rows.map(r=>r.join(",")).join("\n");
    const a = document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv); a.download="nomina.csv"; a.click();
  }

  function openEdit(emp: any) {
    setEditing(emp);
    setEditHours(emp.totalHours.toString());
    setEditPay(emp.totalPay.toString());
    setPassword("");
    setMsg("");
  }

  async function saveOverride() {
    if (!password) { setMsg("Debes ingresar tu contraseña"); return; }
    setSaving(true);
    const res = await fetch("/api/payroll/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: editing.id,
        period: editing.period,
        totalHours: editHours,
        totalPay: editPay,
        password: password
      })
    });
    const result = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMsg(result.error || "Error al guardar");
    } else {
      setEditing(null);
      loadData(); // recargar
    }
  }

  async function sendVouchers() {
    if (selected.length === 0) return;
    setSendingVouchers(true);
    setVoucherMsg("");
    
    // Preparar datos de los seleccionados
    const vouchers = data.filter(e => selected.includes(e.id)).map(e => ({
      userId: e.id,
      totalHours: e.totalHours || 0,
      overtimeHours: e.overtimeHours || 0,
      hourlyRate: e.hourlyRate || 0,
      totalPay: e.totalPay || 0
    }));

    try {
      const res = await fetch("/api/payroll/send-vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period, vouchers })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error al enviar");
      
      setVoucherMsg(`¡Se enviaron ${result.count} bauchers con éxito!`);
      setTimeout(() => setVoucherMsg(""), 4000);
      setSelected([]);
    } catch (err: any) {
      setVoucherMsg(err.message);
      setTimeout(() => setVoucherMsg(""), 4000);
    } finally {
      setSendingVouchers(false);
    }
  }

  function toggleSelectAll() {
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(data.map(e => e.id));
    }
  }

  function toggleSelect(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  const inputStyle = {background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"9px 14px",color:text,fontSize:"13px",fontFamily:"var(--font-inter)",outline:"none"};
  const inputModalS = {width:"100%",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",padding:"12px 16px",color:"white",fontSize:"14px",outline:"none",fontFamily:"var(--font-inter)",boxSizing:"border-box" as any};
  const labelModalS = {fontSize:"11px",fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"8px",display:"block",fontFamily:"var(--font-inter)" as any};

  return (
    <div style={{flex:1,overflowY:"auto",background:bg,position:"relative"}}>
      <style>{`
        .glass-panel{background:rgba(255,255,255,0.02);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,0.06);border-radius:24px}
        .btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent-dark));color:#000;font-family:var(--font-inter);font-weight:700;transition:all 0.2s ease;border:none;border-radius:12px;cursor:pointer;box-shadow:0 4px 15px rgba(59,130,246,0.2)}
        .btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(59,130,246,0.3)}
        .btn-primary:disabled{opacity:0.5;cursor:not-allowed}
        .row-hover{transition:background 0.2s ease, transform 0.2s ease}
        .row-hover:hover{background:rgba(255,255,255,0.04)!important}
        .payroll-grid { display: grid; grid-template-columns: 40px 1fr 70px 70px 70px 100px 50px; }
        .hide-desktop { display: none !important; }
        .mobile-row { display: none !important; }
        @keyframes fadeIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @media(max-width:768px){
          .hide-mobile{display:none!important}
          .hide-desktop{display:block!important}
          .stack-mobile{flex-direction:column!important}
          .full-mobile{width:100%!important}
          .payroll-grid { display: flex; flex-direction: column; gap: 8px; }
          .payroll-grid > p:not(:first-child) { display: none; }
          .mobile-row { display: flex !important; justify-content: space-between; width: 100%; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 8px; margin-top: 8px; }
        }
      `}</style>

      {/* Modal de Edición */}
      {editing && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(10px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
          <div className="glass-panel" style={{width:"100%",maxWidth:"400px",padding:"32px",animation:"fadeIn 0.2s ease-out"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px"}}>
              <div>
                <h2 style={{fontFamily:"var(--font-inter)",fontSize:"20px",fontWeight:800,color:"#FFF"}}>Modificar Nómina</h2>
                <p style={{fontFamily:"var(--font-inter)",fontSize:"13px",color:primary,marginTop:"4px"}}>{editing.name}</p>
              </div>
              <button onClick={()=>setEditing(null)} style={{background:"transparent",border:"none",color:"#FFF",cursor:"pointer",opacity:0.5}}><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
              <div>
                <label style={labelModalS}>Horas Totales</label>
                <input type="number" step="0.5" style={inputModalS} value={editHours} onChange={e=>setEditHours(e.target.value)} />
              </div>
              <div>
                <label style={labelModalS}>Pago Total ($)</label>
                <input type="number" step="1" style={inputModalS} value={editPay} onChange={e=>setEditPay(e.target.value)} />
              </div>
              
              <div style={{background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.2)",borderRadius:"12px",padding:"16px",marginTop:"8px"}}>
                <label style={{...labelModalS, color:primary}}>Autorización de Admin</label>
                <input type="password" placeholder="Tu contraseña de administrador" style={{...inputModalS, background:"rgba(0,0,0,0.6)", borderColor:"rgba(59,130,246,0.3)"}} value={password} onChange={e=>setPassword(e.target.value)} />
                {msg && <p style={{color:"#F87171",fontSize:"12px",fontFamily:"var(--font-inter)",marginTop:"8px",fontWeight:600}}>{msg}</p>}
              </div>

              <button onClick={saveOverride} disabled={saving} className="btn-primary" style={{padding:"14px",fontSize:"14px",marginTop:"12px",width:"100%"}}>
                {saving ? "Autorizando..." : "Guardar Modificación"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{height:"64px",borderBottom:"1px solid "+border,padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",zIndex:10}}>
        <div>
          <h1 style={{fontFamily:"var(--font-inter)",fontWeight:700,fontSize:"16px",color:text}}>{lang==="es"?"Nómina":"Payroll"}</h1>
          <p style={{fontFamily:"var(--font-inter)",fontSize:"12px",color:muted,marginTop:"2px"}}>{Array.isArray(data) ? data.length : 0} empleados</p>
        </div>
        <div style={{display:"flex",gap:"12px"}}>
          {selected.length > 0 && (
            <button onClick={sendVouchers} disabled={sendingVouchers} className="btn-primary" style={{padding:"10px 20px",borderRadius:"100px",fontSize:"13px",display:"flex",alignItems:"center",gap:"8px",background:sendingVouchers?"rgba(52,211,153,0.5)":"#34D399",color:"#000",boxShadow:"0 4px 15px rgba(52,211,153,0.3)"}}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              {sendingVouchers ? "Enviando..." : `Enviar ${selected.length} Bauchers`}
            </button>
          )}
          <button onClick={exportCSV} className="btn-primary" style={{padding:"10px 20px",borderRadius:"100px",fontSize:"13px",background:"rgba(255,255,255,0.05)",color:"#FFF",border:"1px solid rgba(255,255,255,0.1)",boxShadow:"none"}}>
            {lang==="es"?"Exportar CSV":"Export CSV"}
          </button>
        </div>
      </div>

      <div style={{padding:"32px",display:"flex",flexDirection:"column",gap:"24px",maxWidth:"1400px",margin:"0 auto",position:"relative",zIndex:10}}>
        
        {/* Controls */}
        <div style={{display:"flex",gap:"16px",alignItems:"center",flexWrap:"wrap"}} className="stack-mobile">
          <select value={period} onChange={e=>setPeriod(e.target.value)} style={inputStyle}>
            <option value="current">Quincena actual</option>
            <option value="previous">Quincena anterior</option>
          </select>
          <div style={{background:"rgba(59, 130, 246,0.05)",border:"1px solid rgba(59, 130, 246,0.15)",borderRadius:"16px",padding:"16px 24px",marginLeft:"auto",display:"flex",alignItems:"center",gap:"20px"}} className="full-mobile">
            <div>
              <p style={{fontFamily:"var(--font-inter)",fontSize:"11px",fontWeight:700,color:"rgba(59, 130, 246,0.8)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"4px"}}>Total Estimado</p>
              <p style={{fontFamily:"var(--font-inter)",fontWeight:800,fontSize:"28px",color:primary,lineHeight:1}}>${total.toLocaleString("en-US",{minimumFractionDigits:2, maximumFractionDigits:2})}</p>
            </div>
            <div style={{width:"40px",height:"40px",borderRadius:"50%",background:"rgba(59,130,246,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:primary}}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
        </div>
        
        {voucherMsg && (
          <div style={{padding:"12px 20px",borderRadius:"12px",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",color:"#34D399",fontFamily:"var(--font-inter)",fontSize:"14px",fontWeight:600,animation:"fadeIn 0.3s ease-out"}}>
            {voucherMsg}
          </div>
        )}

        {/* Table */}
        <div className="glass-panel" style={{overflow:"hidden"}}>
          {loading ? (
            <div style={{padding:"60px",textAlign:"center"}}><p style={{color:muted,fontFamily:"var(--font-inter)",fontSize:"14px"}}>Calculando nómina...</p></div>
          ) : !Array.isArray(data) || data.length===0 ? (
            <div style={{padding:"60px",textAlign:"center"}}><p style={{color:muted,fontFamily:"var(--font-inter)",fontSize:"14px"}}>Sin registros en este período</p></div>
          ) : (
            <>
              <div className="payroll-grid hide-mobile" style={{padding:"16px 24px",borderBottom:"1px solid "+border,background:"rgba(0,0,0,0.2)"}}>
                <div style={{display:"flex",alignItems:"center"}}>
                  <input type="checkbox" checked={selected.length === data.length && data.length > 0} onChange={toggleSelectAll} style={{width:"16px",height:"16px",accentColor:primary,cursor:"pointer"}} />
                </div>
                {["Empleado","Horas","Extras","Tarifa","Total a Pagar",""].map(h=>(
                  <p key={h} style={{fontFamily:"var(--font-inter)",fontSize:"11px",fontWeight:700,color:muted,textTransform:"uppercase",letterSpacing:"1.5px",textAlign:h==="Total a Pagar"||h===""?"right":"left"}}>{h}</p>
                ))}
              </div>
              {data.map(e=>(
                <div key={e.id||e.name} className="row-hover payroll-grid" style={{padding:"16px 24px",borderBottom:"1px solid rgba(255,255,255,0.03)",alignItems:"center",background:selected.includes(e.id)?"rgba(59,130,246,0.03)":"transparent"}}>
                  <div style={{display:"flex",alignItems:"center"}}>
                    <input type="checkbox" checked={selected.includes(e.id)} onChange={()=>toggleSelect(e.id)} style={{width:"16px",height:"16px",accentColor:primary,cursor:"pointer"}} />
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                    <div style={{width:"36px",height:"36px",borderRadius:"12px",background:e.isOverridden?"rgba(245,158,11,0.1)":primary+"15",border:"1px solid "+(e.isOverridden?"rgba(245,158,11,0.2)":primary+"25"),display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-inter)",fontWeight:700,color:e.isOverridden?"#F59E0B":primary,fontSize:"14px",flexShrink:0}}>
                      {(e.name||"?").charAt(0)}
                    </div>
                    <div>
                      <p style={{fontFamily:"var(--font-inter)",fontSize:"14px",color:text,fontWeight:600}}>{e.name}</p>
                      {e.isOverridden && <span style={{fontSize:"10px",color:"#F59E0B",fontFamily:"var(--font-inter)",fontWeight:600}}>Modificado Manualmente</span>}
                    </div>
                  </div>
                  
                  <div className="mobile-row">
                    <p className="hide-desktop" style={{fontFamily:"var(--font-inter)",fontSize:"13px",color:muted}}>Horas: {(e.totalHours||0).toFixed(1)}h</p>
                    <p className="hide-desktop" style={{fontFamily:"var(--font-inter)",fontSize:"13px",color:e.overtimeHours>0?"#FB923C":muted}}>Extras: {(e.overtimeHours||0).toFixed(1)}h</p>
                  </div>
                  
                  <p className="hide-mobile" style={{fontFamily:"var(--font-inter)",fontSize:"13px",color:text,fontWeight:500}}>{(e.totalHours||0).toFixed(1)}h</p>
                  <p className="hide-mobile" style={{fontFamily:"var(--font-inter)",fontSize:"13px",color:e.overtimeHours>0?"#FB923C":muted,fontWeight:500}}>{(e.overtimeHours||0).toFixed(1)}h</p>
                  <p className="hide-mobile" style={{fontFamily:"var(--font-inter)",fontSize:"13px",color:muted}}>${e.hourlyRate||0}/h</p>
                  
                  <p style={{fontFamily:"var(--font-inter)",fontSize:"16px",fontWeight:800,color:e.isOverridden?"#F59E0B":primary, textAlign: "right"}}>${(e.totalPay||0).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  
                  <div style={{textAlign:"right"}}>
                    <button onClick={()=>openEdit(e)} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",padding:"6px",borderRadius:"8px",transition:"all 0.2s"}} onMouseOver={ev=>ev.currentTarget.style.color="#FFF"} onMouseOut={ev=>ev.currentTarget.style.color="rgba(255,255,255,0.3)"} title="Modificar manualmente">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}