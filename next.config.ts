import { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  reactStrictMode: true,
  devIndicators: {
    position: "top-right",
  },
};

export default nextConfig;
