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

export const viewport: Viewport = {
  themeColor: "#D4AF37",
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
      className="dark" 
      style={{ colorScheme: 'dark' }} 
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${syne.variable} ${dmSans.variable} antialiased`} style={{ background: "#030303", color: "white", margin: 0 }}>
        <ThemeProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}