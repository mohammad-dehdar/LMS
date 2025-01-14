/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "uploadthing.com",
      "utfs.io"  // Add this domain for UploadThing
    ]
  }
};

export default nextConfig;
