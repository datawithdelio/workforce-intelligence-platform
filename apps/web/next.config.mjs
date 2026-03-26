/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workforce/ui", "@workforce/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
