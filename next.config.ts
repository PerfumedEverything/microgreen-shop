import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify supports SSR
  // output: 'export', // Removed - using SSR for API routes
  
  // Dist directory for build output
  distDir: ".next",

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
