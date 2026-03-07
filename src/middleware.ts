import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Idiomas definidos para tu proyecto Punchly
  locales: ['en', 'es'],
  defaultLocale: 'es',
  localePrefix: 'as-needed'
});

export const config = {
  // Este matcher es la clave para que Vercel encuentre tus rutas en [locale]
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/', '/(en|es)/:path*']
};