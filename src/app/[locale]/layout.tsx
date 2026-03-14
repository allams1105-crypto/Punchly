import type { Metadata, Viewport } from "next";
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

// Configuración de Viewport
export const viewport: Viewport = {
  themeColor: "#D4AF37",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Punchly.Clock",
  description: "Control de asistencia para tu equipo",
  manifest: "/manifest.json",
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

// La clave está en definir params como una Promise para cumplir con Next.js 15/16
export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Extraemos children y esperamos la resolución de params
  const { children, params } = props;
  const { locale } = await params;

  return (
    <html lang={locale} className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Punchly.Clock" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body 
        className={`${syne.variable} ${dmSans.variable} antialiased`} 
        style={{ background: "#09090b", color: "white", margin: 0 }}
      >
        <ThemeProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}