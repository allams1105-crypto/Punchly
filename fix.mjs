import { writeFileSync, readFileSync } from "fs";

let content = readFileSync("src/app/[locale]/admin/dashboard/page.tsx", "utf8");

content = content.replace(
  `<Link href="/en/admin/kiosk" className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
            Kiosk
          </Link>`,
  `<Link href="/en/admin/payroll" className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
            Nomina
          </Link>
          <Link href="/en/admin/kiosk" className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
            Kiosk
          </Link>`
);

writeFileSync("src/app/[locale]/admin/dashboard/page.tsx", content);
console.log("Listo!");

