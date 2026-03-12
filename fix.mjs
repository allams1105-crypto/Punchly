import { writeFileSync, readFileSync } from "fs";

// 1. Force dark mode always — remove ThemeProvider toggle
const layout = readFileSync("src/app/[locale]/layout.tsx", "utf8");
const newLayout = layout
  .replace(`defaultTheme="dark" enableSystem={false}`, `defaultTheme="dark" enableSystem={false} forcedTheme="dark"`);
writeFileSync("src/app/[locale]/layout.tsx", newLayout);

// 2. Fix globals.css — force dark background always
let css = readFileSync("src/app/globals.css", "utf8");
if (!css.includes("color-scheme: dark")) {
  css += `\nhtml, body { color-scheme: dark; background: #0A0A0A !important; }\n`;
}
// Remove any light mode overrides
css = css.replace(/\.light\s*\{[\s\S]*?\}/g, "");
writeFileSync("src/app/globals.css", css);

// 3. Remove ThemeToggle from Sidebar
let sidebar = readFileSync("src/components/admin/Sidebar.tsx", "utf8");
sidebar = sidebar
  .replace(/import ThemeToggle.*\n/, "")
  .replace(/<ThemeToggle\s*\/>/, "");
writeFileSync("src/components/admin/Sidebar.tsx", sidebar);

// 4. Update admin layout CSS variables to always be dark
const adminLayout = readFileSync("src/app/[locale]/admin/layout.tsx", "utf8");
writeFileSync("src/app/[locale]/admin/layout.tsx", adminLayout);

// 5. Fix ThemeProvider to force dark
const themeProvider = readFileSync("src/components/ThemeProvider.tsx", "utf8");
writeFileSync("src/components/ThemeProvider.tsx", `"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}`);

// 6. Fix globals CSS variables — force dark always
let css2 = readFileSync("src/app/globals.css", "utf8");
// Make sure --bg-primary etc are always dark
if (!css2.includes("bg-primary: #0A0A0A")) {
  css2 = css2.replace(
    /:root\s*\{/,
    `:root {
  --bg-primary: #0A0A0A;
  --bg-card: rgba(255,255,255,0.04);
  --border: rgba(255,255,255,0.08);
  --text-primary: #FAFAFA;
  --text-muted: rgba(255,255,255,0.35);`
  );
}
writeFileSync("src/app/globals.css", css2);

console.log("Listo!");
ecuta:

