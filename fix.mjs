import { writeFileSync, readFileSync } from "fs";

let f = readFileSync("src/components/employee/EmployeeDashboardClient.tsx", "utf8");

f = f.replace(
  `<div className="px-6 py-4 flex items-center justify-between" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <p className="font-extrabold text-white text-sm" style={{fontFamily:"var(--font-syne)"}}>Mi Panel</p>
        <p className="text-white/30 text-xs" style={{fontFamily:"var(--font-dm-sans)"}}>
          {time.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
        </p>
      </div>`,
  `<div className="px-6 py-4 flex items-center justify-between" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <p className="font-extrabold text-white text-sm" style={{fontFamily:"var(--font-syne)"}}>Mi Panel</p>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <p className="text-white/30 text-xs" style={{fontFamily:"var(--font-dm-sans)"}}>
            {time.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})}
          </p>
          <button onClick={()=>signOut({callbackUrl:"/en"})}
            style={{background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"5px 14px",color:"rgba(255,255,255,0.3)",fontSize:"11px",fontFamily:"var(--font-dm-sans)",cursor:"pointer",transition:"all 0.15s"}}
            onMouseEnter={e=>(e.currentTarget.style.color="#F87171")}
            onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.3)")}>
            Salir
          </button>
        </div>
      </div>`
);

writeFileSync("src/components/employee/EmployeeDashboardClient.tsx", f);
console.log("Listo!");

