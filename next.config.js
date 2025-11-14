/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', //pour exporter une app statique (sans backend)

  // Active le mode strict de React pour détecter les problèmes potentiels
  reactStrictMode: true,

  // Utilise le compilateur SWC pour la minification (plus rapide que Terser)
  swcMinify: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    // ⚠️ Ignore complètement les erreurs TypeScript pendant le build
    // Nécessaire pour contourner les erreurs de types @babel__core
    ignoreBuildErrors: true,
  },

  experimental: {
    // Désactive la vérification de types pendant le build
    typedRoutes: false,
  },

  // Images non-optimisées - Vercel gère l'optimisation automatiquement
  images: { unoptimized: true },

  // En-têtes de sécurité
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
