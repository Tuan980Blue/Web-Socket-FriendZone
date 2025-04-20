import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
