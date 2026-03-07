import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // Los idiomas que soporta tu app "Punchly"
  locales: ['en', 'es'],
 
  // Idioma que se usará si no hay uno en la URL
  defaultLocale: 'en',

  // Esto evita que el prefijo del idioma aparezca siempre (opcional)
  localePrefix: 'as-needed'
});
 
export const config = {
  // Este matcher es VITAL. 
  // Indica que el middleware debe actuar en la raíz y en las rutas de idioma,
  // pero ignorar archivos estáticos (como el logo del león de tu marca NEEDY) o la carpeta api.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/', '/(en|es)/:path*']
};