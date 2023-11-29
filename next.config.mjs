/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://172.31.240.178:5002/:path*',
      },
    ]
  },
};

export default nextConfig;
