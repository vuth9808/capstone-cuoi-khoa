/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'airbnbnew.cybersoft.edu.vn',
      },
      {
        protocol: 'https',
        hostname: 'a0.muscache.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: 'sc04.alicdn.com',
      },
      {
        protocol: 'https',
        hostname: 'sc04.alicdn.com',
      },
      {
        protocol: 'https',
        hostname: 's1.media.ngoisao.vn', 
      },
      {
        protocol: 'https',
        hostname: 'www.hotelgrandsaigon.com', 
      },
      {
        protocol: 'https',
        hostname: 'bizweb.dktcdn.net', 
      },
      {
        protocol: 'https',
        hostname: 'www.spinxdigital.com',
      },
      {
        protocol: 'https',
        hostname: 'www.citypng.com',
      },
      {
        protocol: 'https',
        hostname: 's3.ap-southeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'media.cntraveler.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.brandfetch.io',
      },
    ],
  },
};

module.exports = nextConfig;
