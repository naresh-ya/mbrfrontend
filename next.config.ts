import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure proper SSR/client hydration for Amplify deployment
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Amplify-specific optimizations
  // Ensure proper build output
  output: 'standalone',
};

export default nextConfig;
