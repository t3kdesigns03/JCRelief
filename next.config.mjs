/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — the whole site is client/static, so this deploys as plain
  // HTML/CSS/JS. Netlify serves the `out/` folder directly (no serverless needed).
  output: "export",
  images: {
    // Required when using `output: export` (we don't use next/image, but safe).
    unoptimized: true,
  },
};

export default nextConfig;
