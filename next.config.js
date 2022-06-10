/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'raw.githubusercontent.com',
      'assets.coingecko.com',
      'avatars.githubusercontent.com',
      'upload.wikimedia.org',
    ],
  },
}

module.exports = nextConfig
