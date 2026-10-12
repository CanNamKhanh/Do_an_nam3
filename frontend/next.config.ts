import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:BACKEND_PORT/api/:path*",
      },
    ];
  },
};

export default nextConfig;
