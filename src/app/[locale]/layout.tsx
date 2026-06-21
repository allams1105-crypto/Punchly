import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LangProvider } from "@/lib/LangContext";
import AmbientBackground from "@/components/shared/AmbientBackground";

const inter = Inter({ 
  variable: "--font-inter", 
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800"]
});

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children, params } = props;
  const { locale } = await params;

  return (
    <html 
      lang={locale} 
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} antialiased`} style={{ background: "transparent", color: "var(--text-primary)", margin: 0 }}>
        <ThemeProvider>
          <LangProvider>
            <AmbientBackground />
            <div style={{ position: "relative", zIndex: 1, height: "100vh", overflow: "auto" }}>
              {children}
            </div>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}