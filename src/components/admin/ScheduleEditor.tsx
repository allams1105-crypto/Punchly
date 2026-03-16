"use client";
import { useState } from "react";

const DAYS = [
  { key: "monday",    label: "Lun", startKey: "monStart", endKey: "monEnd" },
  { key: "tuesday",   label: "Mar", startKey: "tueStart", endKey: "tueEnd" },
  { key: "wednesday", label: "Mié", startKey: "wedStart", endKey: "wedEnd" },
  { key: "thursday",  label: "Jue", startKey: "thuStart", endKey: "thuEnd" },
  { key: "friday",    label: "Vie", startKey: "friStart", endKey: "friEnd" },
  { key: "saturday",  label: "Sáb", startKey: "satStart", endKey: "satEnd" },
  { key: "sunday",    label: "Dom", startKey: "sunStart", endKey: "sunEnd" },
];

export default function ScheduleEditor({ userId, initialSchedule }: { userId: string; initialSchedule: any }) {
  const [days, setDays] = useState<Record<string,boolean>>({
    monday:    initialSchedule?.monday    ?? true,
    tuesday:   initialSchedule?.tuesday   ?? true,
    wednesday: initialSchedule?.wednesday ?? true,
    thursday:  initialSchedule?.thursday  ?? true,
    friday:    initialSchedule?.friday    ?? true,
    saturday:  initialSchedule?.saturday  ?? false,
    sunday:    initialSchedule?.sunday    ?? false,
  });

  const [times, setTimes] = useState<Record<string,string>>({
    monStart: initialSchedule?.monStart || initialSchedule?.startTime || "08:00",
    monEnd:   initialSchedule?.monEnd   || initialSchedule?.endTime   || "17:00",
    tueStart: initialSchedule?.tueStart || initialSchedule?.startTime || "08:00",
    tueEnd:   initialSchedule?.tueEnd   || initialSchedule?.endTime   || "17:00",
    wedStart: initialSchedule?.wedStart || initialSchedule?.startTime || "08:00",
    wedEnd:   initialSchedule?.wedEnd   || initialSchedule?.endTime   || "17:00",
    thuStart: initialSchedule?.thuStart || initialSchedule?.startTime || "08:00",
    thuEnd:   initialSchedule?.thuEnd   || initialSchedule?.endTime   || "17:00",
    friStart: initialSchedule?.friStart || initialSchedule?.startTime || "08:00",
    friEnd:   initialSchedule?.friEnd   || initialSchedule?.endTime   || "17:00",
    satStart: initialSchedule?.satStart || initialSchedule?.startTime || "08:00",
    satEnd:   initialSchedule?.satEnd   || initialSchedule?.endTime   || "17:00",
    sunStart: initialSchedule?.sunStart || initialSchedule?.startTime || "08:00",
    sunEnd:   initialSchedule?.sunEnd   || initialSchedule?.endTime   || "17:00",
  });

  const [tolerance, setTolerance] = useState(initialSchedule?.toleranceMin ?? 10);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setSaving(true);
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...days, ...times, toleranceMin: tolerance }),
    });
    setMsg(res.ok ? "Guardado" : "Error");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  }

  const inputS: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "6px 8px",
    color: "#FAFAFA",
    fontSize: "12px",
    fontFamily: "var(--font-dm-sans)",
    outline: "none",
    width: "80px",
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
      <style>{`input[type=time]:focus,input[type=range]:focus{outline:none}`}</style>

      {/* Days with individual times */}
      <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
        {DAYS.map(d => (
          <div key={d.key} style={{
            display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",borderRadius:"12px",
            background:days[d.key]?"rgba(201,168,76,0.06)":"rgba(255,255,255,0.02)",
            border:days[d.key]?"1px solid rgba(201,168,76,0.15)":"1px solid rgba(255,255,255,0.05)",
            transition:"all 0.15s"
          }}>
            {/* Day toggle */}
            <button onClick={()=>setDays(p=>({...p,[d.key]:!p[d.key]}))}
              style={{
                width:"36px",height:"20px",borderRadius:"100px",border:"none",cursor:"pointer",
                flexShrink:0,transition:"all 0.2s",position:"relative",
                background:days[d.key]?"linear-gradient(135deg,#C9A84C,#F0D080)":"rgba(255,255,255,0.1)",
              }}>
              <div style={{
                position:"absolute",top:"2px",width:"16px",height:"16px",borderRadius:"50%",background:"white",
                transition:"all 0.2s",left:days[d.key]?"18px":"2px",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"
              }} />
            </button>

            <span style={{
              fontFamily:"var(--font-syne)",fontWeight:700,fontSize:"12px",width:"28px",flexShrink:0,
              color:days[d.key]?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.3)"
            }}>{d.label}</span>

            {days[d.key] ? (
              <div style={{display:"flex",alignItems:"center",gap:"6px",flex:1}}>
                <input type="time" value={times[d.startKey]} onChange={e=>setTimes(p=>({...p,[d.startKey]:e.target.value}))}
                  style={inputS} />
                <span style={{color:"rgba(255,255,255,0.2)",fontSize:"11px"}}>—</span>
                <input type="time" value={times[d.endKey]} onChange={e=>setTimes(p=>({...p,[d.endKey]:e.target.value}))}
                  style={inputS} />
                <span style={{fontSize:"11px",color:"rgba(255,255,255,0.25)",fontFamily:"var(--font-dm-sans)",marginLeft:"4px"}}>
                  {(() => {
                    const [sh,sm] = times[d.startKey].split(":").map(Number);
                    const [eh,em] = times[d.endKey].split(":").map(Number);
                    const diff = (eh*60+em) - (sh*60+sm);
                    if (diff <= 0) return "";
                    return diff >= 60 ? Math.floor(diff/60)+"h"+(diff%60>0?" "+diff%60+"m":"") : diff+"m";
                  })()}
                </span>
              </div>
            ) : (
              <span style={{fontSize:"11px",color:"rgba(255,255,255,0.2)",fontFamily:"var(--font-dm-sans)"}}>Día libre</span>
            )}
          </div>
        ))}
      </div>

      {/* Tolerance */}
      <div style={{padding:"12px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>
          <span style={{fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"1px",fontFamily:"var(--font-dm-sans)"}}>Tolerancia de llegada</span>
          <span style={{fontSize:"12px",fontWeight:700,color:"#C9A84C",fontFamily:"var(--font-syne)"}}>{tolerance} min</span>
        </div>
        <input type="range" min="0" max="60" step="5" value={tolerance}
          onChange={e=>setTolerance(Number(e.target.value))}
          style={{width:"100%",accentColor:"#C9A84C"}} />
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"10px",color:"rgba(255,255,255,0.2)",marginTop:"4px",fontFamily:"var(--font-dm-sans)"}}>
          <span>0 min</span><span>60 min</span>
        </div>
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        {msg && <p style={{fontSize:"12px",color:msg==="Guardado"?"#34D399":"#F87171",fontFamily:"var(--font-dm-sans)"}}>{msg}</p>}
        <button onClick={save} disabled={saving}
          style={{marginLeft:"auto",background:"linear-gradient(135deg,#C9A84C,#F0D080)",color:"#000",padding:"10px 20px",borderRadius:"12px",fontSize:"13px",fontFamily:"var(--font-syne)",fontWeight:700,border:"none",cursor:"pointer",opacity:saving?0.6:1}}>
          {saving?"Guardando...":"Guardar horario"}
        </button>
      </div>
    </div>
  );
}