import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Añadimos patrones comunes para evitar bloqueos
const PUBLIC_FILE_CHECK = /\.(.*)$/; 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Permitir archivos estáticos y de sistema (manifest, iconos, sw.js)
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") ||
    pathname.includes("manifest.json") ||
    pathname.includes("favicon.ico") ||
    pathname.includes("sw.js") ||
    PUBLIC_FILE_CHECK.test(pathname)
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Ajustamos el matcher para que ignore explícitamente archivos estáticos y la carpeta api
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-).*)",
  ],
};