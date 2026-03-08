import { writeFileSync, readFileSync } from "fs";

let content = readFileSync("src/app/[locale]/admin/dashboard/page.tsx", "utf8");

content = content.replace(
  `import UpgradeButton from "@/components/admin/UpgradeButton";`,
  `import UpgradeButton from "@/components/admin/UpgradeButton";
import HoursChart from "@/components/admin/HoursChart";`
);

content = content.replace(
  `  const totalPayroll = payrollData.reduce((acc, e) => acc + e.totalPay, 0);`,
  `  const totalPayroll = payrollData.reduce((acc, e) => acc + e.totalPay, 0);
  const chartData = payrollData.map((emp) => ({
    name: emp.name.split(" ")[0],
    hours: emp.totalHours,
    pay: emp.totalPay,
  }));`
);

content = content.replace(
  `        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Nomina quincenal</h2>`,
  `        <HoursChart data={chartData} />

        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Nomina quincenal</h2>`
);

writeFileSync("src/app/[locale]/admin/dashboard/page.tsx", content);
console.log("Listo!");

