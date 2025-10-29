/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const nextConfig = {
  // Enable Strict Mode only in production to avoid double-invocation flicker in dev
  reactStrictMode: isProd,
  images: {
    domains: ['yavokvrcskbxhotpcejo.supabase.co', 'images.unsplash.com'],
  },
}

module.exports = nextConfig
