/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/es', // Cambia a /en si prefieres inglés por defecto
        permanent: true,
      },
    ]
  },
  // ... el resto de tu configuración (i18n, etc)
};

export default nextConfig;