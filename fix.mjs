import { writeFileSync, readFileSync } from "fs";

let f = readFileSync("src/components/employee/EmployeeDashboardClient.tsx", "utf8");

// Replace signOut button with direct redirect
f = f.replace(
  `<button onClick={()=>signOut({callbackUrl:"/en"})}
            style={{background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"5px 14px",color:"rgba(255,255,255,0.3)",fontSize:"11px",fontFamily:"var(--font-dm-sans)",cursor:"pointer",transition:"all 0.15s"}}
            onMouseEnter={e=>(e.currentTarget.style.color="#F87171")}
            onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.3)")}>
            Salir
          </button>`,
  `<button onClick={async()=>{ await signOut({callbackUrl:"/en",redirect:true}); }}
            style={{background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"5px 14px",color:"rgba(255,255,255,0.3)",fontSize:"11px",fontFamily:"var(--font-dm-sans)",cursor:"pointer",transition:"all 0.15s"}}
            onMouseEnter={e=>(e.currentTarget.style.color="#F87171")}
            onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.3)")}>
            Salir
          </button>`
);

// Make sure signOut is imported
if (!f.includes("import { signOut }")) {
  f = f.replace(`"use client";`, `"use client";
import { signOut } from "next-auth/react";`);
}

writeFileSync("src/components/employee/EmployeeDashboardClient.tsx", f);
console.log("Listo!");

