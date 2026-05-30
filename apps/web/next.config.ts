import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@ministack-ui/ui',
    '@ministack-ui/shared',
    '@ministack-ui/runtime-sdk',
    '@ministack-ui/log-engine',
    '@ministack-ui/event-engine',
  ],
};

export default nextConfig;
