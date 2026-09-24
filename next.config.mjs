import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

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

export default async function config(phase, context) {
  // The public site uses on-device retrieval. Ollama/Eve belongs to local dev,
  // so production must not provision an unused agent service or proxy to it.
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    const { withEve } = await import("eve/next");
    return withEve(nextConfig)(phase, context);
  }
  return nextConfig;
}
