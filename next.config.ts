import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

module.exports = {
  images: {
    remotePatterns: [new URL('https://lime-rainy-whitefish-274.mypinata.cloud/ipfs/**')],
  },
}

export default nextConfig;
