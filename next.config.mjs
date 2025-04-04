

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["calcuttafreshfoods.com"],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "storage.googleapis.com",
        },
      ],
    },
  };
  
  export default nextConfig;
  