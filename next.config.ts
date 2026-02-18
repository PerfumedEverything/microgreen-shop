import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify supports SSR, so we don't need static export
  // output: 'export', // Only for GitFlic Pages or other static hosts

  // Dist directory for build output
  distDir: ".next", // Default Next.js output directory

  // Image optimization
  images: {
    unoptimized: false, // Enable Next.js image optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Trailing slashes for better SEO
  trailingSlash: true,

  // Environment variables that should be available at build time
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
