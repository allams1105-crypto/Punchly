import fs from 'fs';
import path from 'path';

function fixGold(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/\bGOLD\b/g, 'PRIMARY');
  fs.writeFileSync(filePath, content, 'utf-8');
}

fixGold('src/components/kiosk/KioskClient.tsx');
fixGold('src/components/employee/EmployeeDashboardClient.tsx');
console.log('Fixed GOLD -> PRIMARY');
