/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        reactCompiler: true,
    },
    logging: {
        fetches: {
            fullUrl: false,
            hmrRefreshes: true,
        },
    },
    reactStrictMode: true,
    devIndicators: {
        appIsrStatus: false,
        buildActivityPosition: "top-right",
        buildActivity: true,
    },

};

export default nextConfig; 