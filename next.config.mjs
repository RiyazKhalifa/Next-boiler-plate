/** @type {import('next').NextConfig} */

const originalEmit = process.emit;
process.emit = function (name, data, ...args) {
    if (name === "warning" && typeof data === "object" && data.name === "DeprecationWarning" && data.message.includes("url.parse")) {
        return false;
    }
    return originalEmit.apply(process, [name, data, ...args]);
};

const nextConfig = {
    reactStrictMode: false,

    basePath: process.env.BASEPATH || "",

    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost'
            },
            {
                protocol: 'https',
                hostname: '**'
            }
        ]
    },

    async redirects() {
        return [
            {
                source: "/",
                destination: "/dashboard",
                permanent: true,
                locale: false
            }
        ]
    },

    experimental: {
        serverActions: {
            bodySizeLimit: '100mb'
        },
        optimizePackageImports: [
            '@mui/material',
            '@mui/icons-material',
            'lodash',
            'date-fns'
        ]
    },

    transpilePackages: [
        '@mui/material',
        '@mui/icons-material'
    ],

    productionBrowserSourceMaps: false
}

export default nextConfig