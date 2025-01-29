import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['yuudee.net'],
  },
};
module.exports = {
  env: {
    BASE_URL: process.env.NODE_ENV === "production"
      ? "https://yuudee.net"
      : "http://localhost:3000",
  }
};

export default nextConfig;
