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
  // Enable standalone output for Docker production builds
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),
}

export default nextConfig