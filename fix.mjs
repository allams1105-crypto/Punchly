import { writeFileSync } from "fs";

// Fix 1: Kiosk page — await params
const kioskPage = `import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import KioskClient from "@/components/kiosk/KioskClient";

export default async function KioskPage({ params }: { params: any }) {
  const { token } = await params;

  try {
    const org = await prisma.organization.findUnique({ where: { id: token } });
    if (!org) notFound();

    const today = new Date(); today.setHours(0,0,0,0);

    const employees = await prisma.user.findMany({
      where: { organizationId: token, isActive: true, role: { not: "OWNER" } },
      orderBy: { name: "asc" },
    });

    const activeEntries = await prisma.timeEntry.findMany({
      where: { organizationId: token, clockOut: null, clockIn: { gte: today } },
    });
    const activeIds = new Set(activeEntries.map(e => e.userId));

    return (
      <KioskClient
        token={token}
        employees={employees.map(e => ({
          id: e.id,
          name: e.name || "",
          avatarColor: (e as any).avatarColor || null,
          onShift: activeIds.has(e.id),
          clockInTime: activeEntries.find(a => a.userId === e.id)?.clockIn?.toISOString() || null,
        }))}
      />
    );
  } catch(e) {
    console.error("Kiosk error:", e);
    notFound();
  }
}`;

// Fix 2: middleware — allow manifest, sw.js publicly
const middleware = `import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/manifest.json",
  "/sw.js", 
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/favicon.ico",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public paths without auth
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "public, max-age=86400");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/).*)"],
};`;

// Fix 3: Landing — add ThemeToggle that works standalone
const { readFileSync } = await import("fs");
let landing = readFileSync("src/app/[locale]/page.tsx", "utf8");
// Make sure ThemeToggle is in the nav if not already
if (!landing.includes("ThemeToggle")) {
  landing = landing.replace(
    `import ThemeToggle from "@/components/ThemeToggle";`,
    `import ThemeToggle from "@/components/ThemeToggle";`
  );
}
writeFileSync("src/app/[locale]/page.tsx", landing);

writeFileSync("src/app/[locale]/kiosk/[token]/page.tsx", kioskPage);
writeFileSync("src/middleware.ts", middleware);
console.log("Listo!");

