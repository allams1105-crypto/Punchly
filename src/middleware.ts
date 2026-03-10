import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Por ahora, solo dejamos pasar la petición sin bloquear nada
  // para que puedas navegar libremente mientras arreglamos las rutas.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Ignora todos los archivos internos de Next.js (_next)
     * Ignora todos los archivos estáticos (imágenes, manifest, favicon)
     * Ignora la carpeta de API
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\..*).*)",
  ],
};