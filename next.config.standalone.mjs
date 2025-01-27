// This file exists for Docker deployments and Docker Images on Github
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    reactCompiler: true,
  }
};

export default nextConfig;
