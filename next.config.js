/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', //pour exporter une app statique (sans backend)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ Ignore les erreurs TypeScript pendant le build
    // À utiliser temporairement - TODO: Corriger les types manquants
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
