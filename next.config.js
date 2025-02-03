/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  transpilePackages: ['ytdl-core'],
  webpack: (config) => {
    config.resolve.fallback = { 'ytdl-core': false }
    return config
  },
}

module.exports = nextConfig 