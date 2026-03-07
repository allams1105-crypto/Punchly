import { writeFileSync, readFileSync } from "fs";

let content = readFileSync("src/app/[locale]/admin/dashboard/page.tsx", "utf8");

content = content.replace(
  `import Link from "next/link";`,
  `import Link from "next/link";
import UpgradeButton from "@/components/admin/UpgradeButton";`
);

content = content.replace(
  `          <a href="/api/auth/signout" className="text-xs text-gray-400 hover:text-gray-700">
            Salir
          </a>`,
  `          <UpgradeButton />
          <a href="/api/auth/signout" className="text-xs text-gray-400 hover:text-gray-700">
            Salir
          </a>`
);

writeFileSync("src/app/[locale]/admin/dashboard/page.tsx", content);
console.log("Listo!");