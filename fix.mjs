import { writeFileSync, readFileSync } from "fs";

// Global responsive CSS to add to globals.css
let css = readFileSync("src/app/globals.css", "utf8");
if (!css.includes("responsive-punchly")) {
  css += `
/* === PUNCHLY RESPONSIVE === */
/* responsive-punchly */
@media (max-width: 768px) {
  /* Sidebar hidden on mobile */
  .punchly-sidebar { display: none !important; }
  .punchly-main { width: 100% !important; }
  
  /* Mobile nav bar */
  .punchly-mobile-nav { display: flex !important; }
  
  /* General */
  .hide-mobile { display: none !important; }
  .stack-mobile { flex-direction: column !important; }
  .full-mobile { width: 100% !important; }
  .grid-mobile-1 { grid-template-columns: 1fr !important; }
  .grid-mobile-2 { grid-template-columns: 1fr 1fr !important; }
  .text-mobile-sm { font-size: 12px !important; }
  .p-mobile { padding: 16px !important; }
}
@media (min-width: 769px) {
  .punchly-mobile-nav { display: none !important; }
}
`;
  writeFileSync("src/app/globals.css", css);
}

// Admin layout — add mobile nav bar
const adminLayout = readFileSync("src/app/[locale]/admin/layout.tsx", "utf8");
if (!adminLayout.includes("punchly-mobile-nav")) {
  const newLayout = adminLayout.replace(
    `return (`,
    `return (`
  ).replace(
    `<div className="flex h-screen overflow-hidden`,
    `<div className="flex h-screen overflow-hidden`
  );
  
  // Just add mobile nav to the layout
  writeFileSync("src/app/[locale]/admin/layout.tsx", adminLayout.replace(
    `</div>\n  );\n}`,
    `  {/* Mobile bottom nav */}
    <nav className="punchly-mobile-nav" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(6,8,16,0.95)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.08)",padding:"8px 4px",display:"none",alignItems:"center",justifyContent:"space-around"}}>
      <a href="/en/admin/dashboard" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"6px 12px",borderRadius:"12px",textDecoration:"none",color:"rgba(255,255,255,0.4)",fontSize:"10px",fontFamily:"var(--font-dm-sans)"}}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        Dashboard
      </a>
      <a href="/en/admin/employees" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"6px 12px",borderRadius:"12px",textDecoration:"none",color:"rgba(255,255,255,0.4)",fontSize:"10px",fontFamily:"var(--font-dm-sans)"}}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        Empleados
      </a>
      <a href="/en/admin/attendance" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"6px 12px",borderRadius:"12px",textDecoration:"none",color:"rgba(255,255,255,0.4)",fontSize:"10px",fontFamily:"var(--font-dm-sans)"}}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        Asistencia
      </a>
      <a href="/en/admin/kiosk" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"6px 12px",borderRadius:"12px",textDecoration:"none",color:"rgba(255,255,255,0.4)",fontSize:"10px",fontFamily:"var(--font-dm-sans)"}}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
        Kiosk
      </a>
      <a href="/en/admin/settings" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"6px 12px",borderRadius:"12px",textDecoration:"none",color:"rgba(255,255,255,0.4)",fontSize:"10px",fontFamily:"var(--font-dm-sans)"}}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        Config
      </a>
    </nav>
  </div>
  );
}`
  ));
}

// Sidebar — hide on mobile, add class
let sidebar = readFileSync("src/components/admin/Sidebar.tsx", "utf8");
if (!sidebar.includes("punchly-sidebar")) {
  sidebar = sidebar.replace(
    `<div style={{width:"220px"`,
    `<div className="punchly-sidebar" style={{width:"220px"`
  );
  writeFileSync("src/components/admin/Sidebar.tsx", sidebar);
}

// Employee dashboard — add bottom padding for mobile nav
let empDash = readFileSync("src/components/employee/EmployeeDashboardClient.tsx", "utf8");
empDash = empDash.replace(
  `<div style={{flex:1,overflowY:"auto"`,
  `<div style={{flex:1,overflowY:"auto",paddingBottom:"env(safe-area-inset-bottom,0px)"`
);
writeFileSync("src/components/employee/EmployeeDashboardClient.tsx", empDash);

// Add mobile responsive meta to layout
let layout = readFileSync("src/app/[locale]/layout.tsx", "utf8");
if (!layout.includes("viewport")) {
  layout = layout.replace(
    `<link rel="manifest"`,
    `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <link rel="manifest"`
  );
  writeFileSync("src/app/[locale]/layout.tsx", layout);
}

console.log("Listo!");

