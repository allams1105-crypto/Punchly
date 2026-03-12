import { writeFileSync } from "fs";

writeFileSync("src/app/[locale]/layout.tsx", `import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LangProvider } from "@/lib/LangContext";

const syne = Syne({ 
  variable: "--font-syne", 
  subsets: ["latin"],
  weight: ["400","500","600","700","800"]
});

const dmSans = DM_Sans({ 
  variable: "--font-dm-sans", 
  subsets: ["latin"],
  weight: ["300","400","500","600"]
});

export const metadata: Metadata = {
  title: "Punchly.Clock",
  description: "Control de asistencia para tu equipo",
  manifest: "/manifest.json",
  themeColor: "#C9A84C",
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
    <html lang="es" suppressHydrationWarning className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Punchly.Clock" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={\`\${syne.variable} \${dmSans.variable} antialiased\`} style={{background:"#0A0A0A"}}>
        <ThemeProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}`);

// Fix admin layout TrialBanner props
const { readFileSync } = await import("fs");
let adminLayout = readFileSync("src/app/[locale]/admin/layout.tsx", "utf8");
adminLayout = adminLayout.replace(/daysLeft=\{daysLeft\}\s*expired=\{[^}]+\}/, "daysLeft={daysLeft}");
writeFileSync("src/app/[locale]/admin/layout.tsx", adminLayout);

console.log("Listo!");

