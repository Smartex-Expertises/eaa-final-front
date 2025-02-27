import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Ignore les erreurs TypeScript lors du build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Ignore les erreurs ESLint lors du build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
