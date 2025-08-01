import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    domains: ['res.cloudinary.com'], // Add your Cloudinary domain here
  },
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    
    
    });
    return config;
  },
};


export default nextConfig;
