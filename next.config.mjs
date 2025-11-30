/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use a serverful output so API routes (e.g. /api/meta-preview) remain available
  // and we avoid incompatibilities with static HTML export.
  output: 'standalone',
};

export default nextConfig;
