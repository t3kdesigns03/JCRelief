/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Server mode — required for middleware, server actions, and Supabase RLS writes.
  images: {
    unoptimized: true,
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
