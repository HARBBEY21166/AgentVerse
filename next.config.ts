import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
    ],
  },
  serverComponentsExternalPackages: ['@genkit-ai/googleai', '@genkit-ai/next', 'genkit'],
  webpack: (config) => {
    config.ignoreWarnings = [
      {
        module: /.*\/node_modules\/handlebars\/lib\/index\.js$/,
        message: /the request of a dependency is an expression/,
      },
    ];
    return config;
  },
};

export default nextConfig;
