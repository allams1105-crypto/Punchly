import { writeFileSync } from "fs";

const themeProvider = `"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
}) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}`;

writeFileSync("src/components/ThemeProvider.tsx", themeProvider);
console.log("Listo!");

