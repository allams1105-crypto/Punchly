import { writeFileSync, readFileSync } from "fs";

let content = readFileSync("src/app/[locale]/admin/dashboard/page.tsx", "utf8");

content = content.replace(
  `import HoursChart from "@/components/admin/HoursChart";`,
  `import HoursChart from "@/components/admin/HoursChart";
import ThemeToggle from "@/components/ThemeToggle";`
);

content = content.replace(
  `<a href="/api/auth/signout" className="text-xs text-gray-400 hover:text-gray-700">Salir</a>`,
  `<ThemeToggle />
          <a href="/api/auth/signout" className="text-xs text-gray-400 hover:text-gray-700">Salir</a>`
);

// Dark mode classes
content = content.replace(
  `<div className="min-h-screen bg-gray-50">`,
  `<div className="min-h-screen bg-gray-50 dark:bg-gray-950">`
);

content = content.replace(
  `<div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">`,
  `<div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">`
);

content = content.replace(
  `<span className="text-xl font-bold text-gray-900">Punchly</span>`,
  `<span className="text-xl font-bold text-gray-900 dark:text-white">Punchly</span>`
);

writeFileSync("src/app/[locale]/admin/dashboard/page.tsx", content);
console.log("Listo!");

