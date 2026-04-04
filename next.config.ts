import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,

  // ── LCP Optimizations ──
  experimental: {
    // Optimise package imports — tree-shake heavy deps
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@supabase/supabase-js",
    ],
  },
};

export default nextConfig;
