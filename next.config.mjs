/** @type {import('next').NextConfig} */
// Force rebuild - removing old Floating Lyrics app, deploying new YT-mp3
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
