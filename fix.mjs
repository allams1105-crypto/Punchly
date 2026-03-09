import { writeFileSync, mkdirSync } from "fs";
import { readFileSync } from "fs";

// Fix 1: Change 14 days to 7 days in translations
let trans = readFileSync("src/lib/translations.ts", "utf8");
trans = trans
  .replace(/14 días gratis/g, "7 días gratis")
  .replace(/14 days free/g, "7 days free")
  .replace(/14 días · sin tarjeta/g, "7 días gratis")
  .replace(/14 days · no card/g, "7 days free")
  .replace(/sin tarjeta de crédito\./g, "")
  .replace(/No credit card\./g, "")
  .replace(/sin tarjeta/g, "")
  .replace(/no card/g, "")
  .replace(/Sin tarjeta\./g, "")
  .replace(/no card required/gi, "");
writeFileSync("src/lib/translations.ts", trans);

// Fix 2: Update admin layout — 7 days trial with countdown
const adminLayout = `import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import TrialBanner from "@/components/admin/TrialBanner";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/en/login");

  const role = (session.user as any).role;
  if (role !== "OWNER" && role !== "ADMIN") redirect("/en/employee/dashboard");

  const orgId = (session.user as any).organizationId;
  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  const createdAt = org?.createdAt ? new Date(org.createdAt) : new Date();
  const daysSince = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const trialDays = 7;
  const daysLeft = Math.max(0, trialDays - daysSince);
  const trialExpired = daysSince >= trialDays;
  const isPro = !!(org as any)?.isPro;

  if (trialExpired && !isPro) redirect("/en/paywall");

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      <Sidebar orgName={org?.name || "Mi Empresa"} />
      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        {!isPro && <TrialBanner daysLeft={daysLeft} expired={false} />}
        {children}
      </div>
    </div>
  );
}`;

// Fix 3: Trial banner with countdown
const trialBanner = `"use client";
import Link from "next/link";

export default function TrialBanner({ daysLeft, expired }: { daysLeft: number; expired: boolean }) {
  if (expired) return null;

  const urgent = daysLeft <= 2;

  return (
    <div className={\`w-full px-4 py-2 flex items-center justify-between gap-3 \${urgent ? "bg-red-500/10 border-b border-red-500/20" : "bg-[#E8B84B]/10 border-b border-[#E8B84B]/20"}\`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={\`shrink-0 flex flex-col items-center justify-center w-8 h-8 rounded-lg font-black text-sm leading-none \${urgent ? "bg-red-500/20 text-red-400" : "bg-[#E8B84B]/20 text-[#E8B84B]"}\`}>
          <span className="text-base font-black">{daysLeft}</span>
        </div>
        <p className={\`text-xs font-medium \${urgent ? "text-red-400" : "text-[#E8B84B]"}\`}>
          {daysLeft === 1
            ? "Queda 1 día de prueba"
            : \`Quedan \${daysLeft} días de prueba — activa tu licencia para no perder el acceso\`}
        </p>
      </div>
      <Link href="/en/admin/settings"
        className={\`shrink-0 text-xs font-black px-3 py-1.5 rounded-lg transition \${urgent ? "bg-red-500 text-white hover:bg-red-600" : "bg-[#E8B84B] text-black hover:bg-[#d4a43a]"}\`}>
        Activar licencia
      </Link>
    </div>
  );
}`;

// Fix 4: Landing page — remove "sin tarjeta", change to 7 days
let landing = readFileSync("src/app/[locale]/page.tsx", "utf8");
landing = landing
  .replace(/14 días gratis, sin tarjeta →/g, "7 días gratis →")
  .replace(/14 days free, no card →/g, "7 days free →")
  .replace(/Sin tarjeta de crédito\. 14 días gratis\. Luego solo \$49 una vez\./g, "7 días gratis. Luego solo $49 una vez.")
  .replace(/No credit card\. 14 days free\. Then just \$49 once\./g, "7 days free. Then just $49 once.")
  .replace(/Sin tarjeta de crédito\. Sin contrato\. Cancela cuando quieras\./g, "7 días gratis. Sin contrato.")
  .replace(/14/g, "7");
writeFileSync("src/app/[locale]/page.tsx", landing);

// Fix 5: PWA manifest with P icon
const manifest = {
  name: "Punchly.Clock",
  short_name: "Punchly",
  description: "Control de asistencia para tu equipo",
  start_url: "/en/admin/dashboard",
  display: "standalone",
  background_color: "#000000",
  theme_color: "#E8B84B",
  orientation: "portrait",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
  ]
};
writeFileSync("public/manifest.json", JSON.stringify(manifest, null, 2));

// Fix 6: SVG icons for PWA
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="120" fill="#E8B84B"/>
  <text x="256" y="360" font-family="Arial Black, sans-serif" font-size="320" font-weight="900" text-anchor="middle" fill="#000000">P</text>
</svg>`;
writeFileSync("public/icon.svg", svgIcon);

// Fix 7: update layout meta for PWA
const localeLayout = `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LangProvider } from "@/lib/LangContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Punchly.Clock",
  description: "Control de asistencia para tu equipo",
  manifest: "/manifest.json",
  themeColor: "#E8B84B",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Punchly.Clock",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Punchly.Clock" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={\`\${geistSans.variable} \${geistMono.variable} antialiased\`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LangProvider>
            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}`;

writeFileSync("src/app/[locale]/layout.tsx", localeLayout);
writeFileSync("src/app/[locale]/admin/layout.tsx", adminLayout);
writeFileSync("src/components/admin/TrialBanner.tsx", trialBanner);
console.log("Listo!");

