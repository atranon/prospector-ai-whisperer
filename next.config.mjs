
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
    // Disable generation of TypeScript types for routes
    typedRoutes: false,
  },
  swcMinify: true,
  reactStrictMode: true,
}

export default nextConfig
