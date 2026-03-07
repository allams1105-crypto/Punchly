import { writeFileSync, readFileSync } from "fs";

let content = readFileSync("src/app/[locale]/admin/dashboard/page.tsx", "utf8");

// Remove duplicate import
content = content.replace(
  `import UpgradeButton from "@/components/admin/UpgradeButton";
import UpgradeButton from "@/components/admin/UpgradeButton";`,
  `import UpgradeButton from "@/components/admin/UpgradeButton";`
);

writeFileSync("src/app/[locale]/admin/dashboard/page.tsx", content);
console.log("Listo!");