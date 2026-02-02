/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    basePath: process.env.BASEPATH || "",
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/dashboard",
                permanent: true,
                locale: false,
            },
        ]
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb',
        },
    },
}

export default nextConfig
