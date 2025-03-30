/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', //pour exporter une app statique (sans backend)
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
