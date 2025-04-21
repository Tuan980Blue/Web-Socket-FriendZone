import type { NextConfig } from "next";

const config: NextConfig = {
  swcMinify: true,
  experimental: {
    // Remove turbo option as it's causing issues
    // Use the correct experimental options for Next.js 15
  },
  images: {
    domains: [
      'randomuser.me',
      'images.unsplash.com',
      'picsum.photos',
      'i.pravatar.cc',
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default config;
