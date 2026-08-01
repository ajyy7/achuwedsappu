import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    '*': ['../../apps/api/**/*'],
  },
};

export default nextConfig;
