import { writeFileSync } from "fs";

const layout = `import type { Metadata } from "next";
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
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Punchly.Clock" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={\`\${syne.variable} \${dmSans.variable} antialiased\`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LangProvider>
            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}`;

// Update globals.css to use the font variables
const { readFileSync } = await import("fs");
let css = readFileSync("src/app/globals.css", "utf8");

// Add font variable definitions if not present
if (!css.includes("--font-syne")) {
  css = css.replace(
    /:root\s*\{/,
    `:root {
  --font-heading: var(--font-syne), 'Syne', system-ui, sans-serif;
  --font-body: var(--font-dm-sans), 'DM Sans', system-ui, sans-serif;`
  );
  
  // Set body font
  if (css.includes("body {")) {
    css = css.replace("body {", "body {\n  font-family: var(--font-body);");
  } else {
    css += `\nbody { font-family: var(--font-body); }\n`;
  }
}

writeFileSync("src/app/[locale]/layout.tsx", layout);
writeFileSync("src/app/globals.css", css);

// Update landing to use CSS variables instead of inline font-family strings
const { readFileSync: rf } = await import("fs");
let landing = rf("src/app/[locale]/page.tsx", "utf8");

// Replace inline @import with CSS variable usage
landing = landing.replace(
  /fontFamily:"'Syne',sans-serif"/g,
  `fontFamily:"var(--font-syne)"`
).replace(
  /fontFamily:"'DM Sans',sans-serif"/g,
  `fontFamily:"var(--font-dm-sans)"`
).replace(
  /family=Syne[^'"]*/g, ""
).replace(
  /<style>.*?@import.*?<\/style>/gs, ""
);

writeFileSync("src/app/[locale]/page.tsx", landing);

// Same for kiosk and employee dashboard
let kiosk = rf("src/components/kiosk/KioskClient.tsx", "utf8");
kiosk = kiosk.replace(/fontFamily:"'Syne',sans-serif"/g, `fontFamily:"var(--font-syne)"`).replace(/fontFamily:"'DM Sans',sans-serif"/g, `fontFamily:"var(--font-dm-sans)"`).replace(/<style>[\s\S]*?@import[\s\S]*?<\/style>/g, "");
writeFileSync("src/components/kiosk/KioskClient.tsx", kiosk);

let emp = rf("src/components/employee/EmployeeDashboardClient.tsx", "utf8");
emp = emp.replace(/fontFamily:"'Syne',sans-serif"/g, `fontFamily:"var(--font-syne)"`).replace(/fontFamily:"'DM Sans',sans-serif"/g, `fontFamily:"var(--font-dm-sans)"`).replace(/<style>[\s\S]*?@import[\s\S]*?<\/style>/g, "");
writeFileSync("src/components/employee/EmployeeDashboardClient.tsx", emp);

// Add .font-syne class to globals
let css2 = readFileSync("src/app/globals.css", "utf8");
if (!css2.includes(".font-syne")) {
  css2 += `\n.font-syne { font-family: var(--font-syne) !important; }\n.font-dm { font-family: var(--font-dm-sans) !important; }\n`;
  writeFileSync("src/app/globals.css", css2);
}

console.log("Listo!");

