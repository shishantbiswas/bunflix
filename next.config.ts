import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
