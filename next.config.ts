import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactCompiler: true,
  output: process.env.DOCKERFILE_DEPLOY ? "standalone" : undefined,
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
