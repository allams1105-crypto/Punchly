"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const COLORS = ["#C9A84C","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#38BDF8","#4ADE80","#E879F9","#94A3B8"];

export default function EmployeeEditClient({ employee }: { employee: any }) {
  const router = useRouter();
  const [name, setName] = useState(employee.name||"");
  const [email, setEmail] = useState(employee.email||"");
  const [hourlyRate, setHourlyRate] = useState(employee.hourlyRate||"");
  const [isActive, setIsActive] = useState(employee.isActive);
  const [avatarColor, setAvatarColor] = useState(employee.avatarColor||"#C9A84C");
  const [kioskPin, setKioskPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState("");

  const initials = (name||"?").split(" ").map((n:string)=>n.charAt(0)).join("").substring(0,2).toUpperCase();

  const iStyle = {width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"10px 14px",color:"#FAFAFA",fontSize:"13px",fontFamily:"var(--font-dm-sans)",transition:"border 0.2s",boxSizing:"border-box" as const};
  const lStyle = {display:"block",fontSize:"11px",fontWeight:600 as const,color:"rgba(255,255,255,0.3)",textTransform:"uppercase" as const,letterSpacing:"1px",marginBottom:"8px",fontFamily:"var(--font-dm-sans)"};

  async function save() {
    setSaving(true);
    const body: any = { name, email, hourlyRate: Number(hourlyRate)||0, isActive };
    if (kioskPin.length===4) body.kioskPin = kioskPin;
    const [r1, r2] = await Promise.all([
      fetch(`/api/employees/${employee.id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }),
      fetch("/api/employees/avatar", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({userId:employee.id,avatarColor}) }),
    ]);
    setMsg(r1.ok?"Guardado":"Error al guardar");
    setSaving(false);
    if (kioskPin) setKioskPin("");
    setTimeout(()=>setMsg(""),3000);
  }

  async function del() {
    if (!confirm("¿Eliminar este empleado? No se puede deshacer.")) return;
    setDeleting(true);
    await fetch(`/api/employees/${employee.id}`, { method:"DELETE" });
    router.push("/en/admin/employees");
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
      <style>{`
        input:focus,select:focus{border:1px solid rgba(201,168,76,0.4)!important;outline:none}
        input,select{color-scheme:dark}
        @media(max-width:768px){.grid-mobile-1{grid-template-columns:1fr!important}}
      `}</style>

      {/* Avatar */}
      <div style={{background:card,backdropFilter:"blur(20px)",border:"1px solid "+border,borderRadius:"20px",overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid "+border}}>
          <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:text}}>Avatar</h3>
        </div>
        <div style={{padding:"20px",display:"flex",alignItems:"center",gap:"20px",flexWrap:"wrap"}}>
          <div style={{width:"64px",height:"64px",borderRadius:"18px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"22px",flexShrink:0,transition:"all 0.3s",background:avatarColor+"18",border:"2px solid "+avatarColor+"30",color:avatarColor}}>
            {initials}
          </div>
          <div>
            <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"12px",color:muted,marginBottom:"10px"}}>Color del avatar</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
              {COLORS.map(c=>(
                <button key={c} onClick={()=>setAvatarColor(c)}
                  style={{width:"24px",height:"24px",borderRadius:"8px",background:c,border:avatarColor===c?"2px solid white":"2px solid transparent",cursor:"pointer",transition:"all 0.2s",transform:avatarColor===c?"scale(1.2)":"scale(1)"}} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{background:card,backdropFilter:"blur(20px)",border:"1px solid "+border,borderRadius:"20px",overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid "+border}}>
          <h3 style={{fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"14px",color:text}}>Información</h3>
        </div>
        <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:"14px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}} className="grid-mobile-1">
            <div>
              <label style={lStyle}>Nombre</label>
              <input value={name} onChange={e=>setName(e.target.value)} style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={iStyle} />
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}} className="grid-mobile-1">
            <div>
              <label style={lStyle}>Tarifa por hora ($)</label>
              <input type="number" value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>Estado</label>
              <select value={isActive?"1":"0"} onChange={e=>setIsActive(e.target.value==="1")} style={iStyle}>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </div>
          </div>
          <div>
            <label style={lStyle}>PIN del Kiosk (4 dígitos)</label>
            <input type="password" value={kioskPin} onChange={e=>setKioskPin(e.target.value.replace(/\D/g,"").substring(0,4))}
              placeholder="Dejar vacío para no cambiar" maxLength={4} style={iStyle} />
            <p style={{fontFamily:"var(--font-dm-sans)",fontSize:"11px",color:"rgba(255,255,255,0.2)",marginTop:"6px"}}>El empleado usará este PIN para fichar en el kiosk</p>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:"4px",flexWrap:"wrap",gap:"10px"}}>
            <button onClick={del} disabled={deleting}
              style={{background:"transparent",border:"none",cursor:"pointer",color:"#F87171",fontSize:"13px",fontFamily:"var(--font-dm-sans)",fontWeight:500,opacity:deleting?0.5:1}}>
              {deleting?"Eliminando...":"Eliminar empleado"}
            </button>
            <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
              {msg && <p style={{fontSize:"12px",color:msg==="Guardado"?"#34D399":"#F87171",fontFamily:"var(--font-dm-sans)"}}>{msg}</p>}
              <button onClick={save} disabled={saving}
                style={{background:"linear-gradient(135deg,#C9A84C,#F0D080)",color:"#000",padding:"10px 20px",borderRadius:"12px",fontSize:"13px",fontFamily:"var(--font-syne)",fontWeight:700,border:"none",cursor:"pointer",opacity:saving?0.6:1,transition:"all 0.3s"}}>
                {saving?"Guardando...":"Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}