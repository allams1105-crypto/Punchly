import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Estructura en memoria para el Rate Limiting (funciona por instancia en Edge/Node)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const LIMIT = 150; // peticiones máximas
const WINDOW_MS = 60 * 1000; // 1 minuto (60,000 ms)

export function proxy(request: NextRequest) {
  // 1. Obtener la IP del cliente (priorizando x-forwarded-for para producción)
  let ip = request.headers.get("x-forwarded-for") || 
           request.headers.get("x-real-ip") || 
           "unknown";

  // Si hay varias IPs en x-forwarded-for, tomamos la primera (la original)
  if (ip && ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  // 2. Lógica del Rate Limiting
  if (ip !== "unknown") {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record) {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    } else {
      if (now - record.timestamp > WINDOW_MS) {
        // Expiró la ventana de tiempo, reiniciamos el contador
        record.count = 1;
        record.timestamp = now;
      } else {
        // Dentro de la ventana de tiempo
        record.count++;
        if (record.count > LIMIT) {
          // ¡Límite excedido! Retornamos 429 y bloqueamos la petición
          return new NextResponse(
            JSON.stringify({ 
              error: "Demasiadas peticiones. Por favor, intenta más tarde.",
              status: 429
            }),
            { 
              status: 429, 
              headers: { 
                "Content-Type": "application/json",
                "Retry-After": "60" 
              } 
            }
          );
        }
      }
    }
  }

  // 3. Limpieza periódica para evitar pérdida de memoria (Memory Leak)
  // Se ejecuta estadísticamente en un 5% de las peticiones para limpiar IPs antiguas
  if (Math.random() < 0.05) {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now - value.timestamp > WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Protegemos todas las rutas de la app (incluyendo /api) 
  // pero excluimos los archivos estáticos inofensivos
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.json).*)',
  ],
};
