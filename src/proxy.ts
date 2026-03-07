import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Idiomas para Punchly
  locales: ['en', 'es'],
  defaultLocale: 'es',
  localePrefix: 'as-needed'
});

export const config = {
  // Este matcher permite que funcionen tus rutas de /api y archivos estáticos
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/', '/(en|es)/:path*']
};