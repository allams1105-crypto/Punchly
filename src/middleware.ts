import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Excluimos explícitamente estáticos, imágenes y las rutas públicas base
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|manifest.json).*)',
  ],
};