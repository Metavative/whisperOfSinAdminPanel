// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//     images: {
//     domains: ['res.cloudinary.com'], // Add your Cloudinary domain here
//   },
//   /* config options here */
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ["@svgr/webpack"],
    
    
//     });
//     return config;
//   },
// };


// export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Modern way to allow remote images (Next.js 13+)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com', // First allowed domain
      },
      {
        protocol: 'https',
        hostname: 'another-trusted-site.com', // Second allowed domain
      },
      {
        protocol: 'https',
        hostname: 'cloudinary.com', // Cloudinary domain
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Better to include this in remotePatterns
      },
    ],
    
    // Legacy domains property (can be removed if only using remotePatterns)
    domains: ['res.cloudinary.com'], 
  },
  
  // Webpack configuration for SVG handling
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;