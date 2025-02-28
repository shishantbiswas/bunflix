/** @type {import('next').NextConfig} */

const nextConfig = {
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