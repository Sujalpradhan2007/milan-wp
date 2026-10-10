import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Next from selecting a parent directory when another package-lock.json
  // exists on the machine. This makes local and Render builds resolve from this
  // application only.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
