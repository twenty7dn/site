/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['secure.davidmc.io','*.cdninstagram.com'],
  },
  experimental: {
    scrollRestoration: true,
  },
  trailingSlash: true,
  env: {
    WORDPRESS_HOST: process.env.WORDPRESS_HOST,
    FRONTEND_HOST: process.env.FRONTEND_HOST,
    IMGIX_HOST: process.env.IMGIX_HOST
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://secure.davidmc.io" }, // replace this your actual origin
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ]
      }
    ]
  }
}

module.exports = nextConfig
