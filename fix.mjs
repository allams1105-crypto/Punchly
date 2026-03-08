import { writeFileSync, readFileSync } from "fs";

// Remove Sidebar import and usage from dashboard
let dash = readFileSync("src/app/[locale]/admin/dashboard/page.tsx", "utf8");

dash = dash.replace(`import Sidebar from "@/components/admin/Sidebar";\n`, "");
dash = dash.replace(`    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      <Sidebar orgName={org?.name || "Mi Empresa"} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">`, `    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)]">`);
dash = dash.replace(`      </div>
    </div>
  );
}`, `    </div>
  );
}`);

writeFileSync("src/app/[locale]/admin/dashboard/page.tsx", dash);
console.log("Listo!");

