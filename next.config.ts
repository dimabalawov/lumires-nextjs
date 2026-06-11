import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.supabase.win",
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "image.tmdb.org" },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.tsx",
      },
    },
  },
};

export default nextConfig;