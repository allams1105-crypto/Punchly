import { writeFileSync, readFileSync } from "fs";

let sidebar = readFileSync("src/components/admin/Sidebar.tsx", "utf8");
sidebar = sidebar
  .replace(/import LangToggle.*\n/, "")
  .replace(/<LangToggle\s*\/>/, "")
  .replace(/import LangToggle[^;]+;/, "");
writeFileSync("src/components/admin/Sidebar.tsx", sidebar);
console.log("Listo!");

