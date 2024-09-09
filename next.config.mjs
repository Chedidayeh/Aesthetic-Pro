/* jshint esversion: 6 */

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      serverActions: {
        bodySizeLimit: '1000MB',
      },
    },
  };
  
  export default nextConfig;
  