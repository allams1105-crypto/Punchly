import { writeFileSync, readFileSync } from "fs";

// Payroll
let payroll = readFileSync("src/app/[locale]/admin/payroll/page.tsx", "utf8");
payroll = payroll.replace(`<div className="min-h-screen bg-gray-50">`, `<div className="min-h-screen bg-gray-50 dark:bg-gray-950">`);
payroll = payroll.replace(`<div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">`, `<div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">`);
payroll = payroll.replace(`<span className="text-xl font-bold text-gray-900">Punchly</span>`, `<span className="text-xl font-bold text-gray-900 dark:text-white">Punchly</span>`);
payroll = payroll.replace(`<span className="text-gray-500 text-sm">Historial de Nomina</span>`, `<span className="text-gray-500 dark:text-gray-400 text-sm">Historial de Nomina</span>`);
payroll = payroll.replace(`<Link href="/en/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Volver</Link>`, `<Link href="/en/admin/dashboard" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Volver</Link>`);
payroll = payroll.replace(`<div className="bg-white rounded-2xl border border-gray-200 p-5">`, `<div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">`);
payroll = payroll.replace(`<label className="block text-xs text-gray-400 mb-1">Ano</label>`, `<label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Ano</label>`);
payroll = payroll.replace(/className="border border-gray-200 rounded-lg px-3 py-2 text-sm"/g, `className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm"`);
payroll = payroll.replace(`<div className="bg-white rounded-2xl border border-gray-200">`, `<div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">`);
payroll = payroll.replace(`<h2 className="text-sm font-semibold text-gray-900">Desglose por empleado</h2>`, `<h2 className="text-sm font-semibold text-gray-900 dark:text-white">Desglose por empleado</h2>`);
writeFileSync("src/app/[locale]/admin/payroll/page.tsx", payroll);

// Settings
let settings = readFileSync("src/app/[locale]/admin/settings/page.tsx", "utf8");
settings = settings.replace(`<div className="min-h-screen bg-gray-50">`, `<div className="min-h-screen bg-gray-50 dark:bg-gray-950">`);
settings = settings.replace(`<div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">`, `<div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">`);
settings = settings.replace(`<span className="text-xl font-bold text-gray-900">Punchly</span>`, `<span className="text-xl font-bold text-gray-900 dark:text-white">Punchly</span>`);
settings = settings.replace(`<span className="text-gray-500 text-sm">Configuracion</span>`, `<span className="text-gray-500 dark:text-gray-400 text-sm">Configuracion</span>`);
settings = settings.replace(`<div className="bg-white rounded-2xl border border-gray-200 p-8">`, `<div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">`);
settings = settings.replace(`<h1 className="text-lg font-bold text-gray-900 mb-6">Configuracion de la empresa</h1>`, `<h1 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Configuracion de la empresa</h1>`);
settings = settings.replace(`<label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la empresa</label>`, `<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la empresa</label>`);
settings = settings.replace(`className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"`, `className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"`);
writeFileSync("src/app/[locale]/admin/settings/page.tsx", settings);

// Activity
let activity = readFileSync("src/app/[locale]/admin/activity/page.tsx", "utf8");
activity = activity.replace(`<div className="min-h-screen bg-gray-50">`, `<div className="min-h-screen bg-gray-50 dark:bg-gray-950">`);
activity = activity.replace(`<div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">`, `<div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">`);
activity = activity.replace(`<span className="text-xl font-bold text-gray-900">Punchly</span>`, `<span className="text-xl font-bold text-gray-900 dark:text-white">Punchly</span>`);
activity = activity.replace(`<span className="text-gray-500 text-sm">Actividad</span>`, `<span className="text-gray-500 dark:text-gray-400 text-sm">Actividad</span>`);
activity = activity.replace(`<div className="bg-white rounded-2xl border border-gray-200">`, `<div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">`);
activity = activity.replace(`<h2 className="text-sm font-semibold text-gray-900">Log de actividad</h2>`, `<h2 className="text-sm font-semibold text-gray-900 dark:text-white">Log de actividad</h2>`);
activity = activity.replace(`<p className="text-sm font-medium text-gray-900">{log.userName}</p>`, `<p className="text-sm font-medium text-gray-900 dark:text-white">{log.userName}</p>`);
writeFileSync("src/app/[locale]/admin/activity/page.tsx", activity);

console.log("Listo!");

