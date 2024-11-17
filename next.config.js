/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lhrtmhuckmfipnjnffna.supabase.co'],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
}
