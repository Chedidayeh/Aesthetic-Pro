/* jshint esversion: 6 */

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['lh3.googleusercontent.com'],
    },
  
    experimental: {
      serverActions: {
        bodySizeLimit: '1000MB',
      },
    },
  };
  
  export default nextConfig;
  