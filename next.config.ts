import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'airbnbnew.cybersoft.edu.vn',
        pathname: '/images/**', // Cho phép tất cả ảnh từ thư mục `/images/`
      },
      {
        protocol: 'https',
        hostname: 'airbnbnew.cybersoft.edu.vn',
        pathname: '/avatar/**', // Cho phép tất cả ảnh từ thư mục `/avatar/`
      },
    ],
  },
};

export default nextConfig;
