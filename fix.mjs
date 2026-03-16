import { writeFileSync, readFileSync } from "fs";

let f = readFileSync("src/components/employee/EmployeeDashboardClient.tsx", "utf8");

// Remove signOut import
f = f.replace(`import { signOut } from "next-auth/react";\n`, "");

// Replace button with simple form POST
f = f.replace(
  `<button onClick={async()=>{ await signOut({callbackUrl:"/en",redirect:true}); }}
            style={{background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"5px 14px",color:"rgba(255,255,255,0.3)",fontSize:"11px",fontFamily:"var(--font-dm-sans)",cursor:"pointer",transition:"all 0.15s"}}
            onMouseEnter={e=>(e.currentTarget.style.color="#F87171")}
            onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.3)")}>
            Salir
          </button>`,
  `<a href="/api/auth/signout?callbackUrl=/en"
            style={{background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",padding:"5px 14px",color:"rgba(255,255,255,0.3)",fontSize:"11px",fontFamily:"var(--font-dm-sans)",cursor:"pointer",textDecoration:"none",transition:"all 0.15s"}}
            onMouseEnter={e=>(e.currentTarget.style.color="#F87171")}
            onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.3)")}>
            Salir
          </a>`
);

writeFileSync("src/components/employee/EmployeeDashboardClient.tsx", f);
console.log("Listo!");

