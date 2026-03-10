import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si es un archivo con extensión (foto, json, ico), déjalo pasar sin preguntas
  if (pathname.includes('.') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ultra-abierto para evitar bloqueos accidentales
  matcher: ["/((?!_next/static|_next/image).*)"],
};