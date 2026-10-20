import type { NextConfig } from "next";
import { imageHosts } from "./src/lib/image-hosts";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageHosts.map((hostname) => ({ protocol: "https", hostname })),
  },
};

export default nextConfig;
