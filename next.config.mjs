/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        reactCompiler: true,
        ppr: true,
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