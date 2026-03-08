import { writeFileSync, readFileSync } from "fs";

let content = readFileSync("src/app/[locale]/admin/dashboard/page.tsx", "utf8");

content = content.replace(
  `<Link href="/en/admin/settings" className="text-xs text-gray-400 hover:text-gray-700">
            Settings
          </Link>`,
  `<Link href="/en/admin/activity" className="text-xs text-gray-400 hover:text-gray-700">
            Actividad
          </Link>
          <Link href="/en/admin/settings" className="text-xs text-gray-400 hover:text-gray-700">
            Settings
          </Link>`
);

writeFileSync("src/app/[locale]/admin/dashboard/page.tsx", content);
console.log("Listo!");

