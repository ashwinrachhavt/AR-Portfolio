import { withEve } from "eve/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: [".monkeycode-ai.live"],
  experimental: {
    optimizePackageImports: [
      "@heroicons/react",
      "framer-motion",
      "react-feather",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 100],
  },
};

export default withEve(nextConfig);
