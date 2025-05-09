/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  },
  // Disable Turbopack in the next dev command
  webpack: (config) => {
    return config;
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://xciyawumdtwyydelhclv.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaXlhd3VtZHR3eXlkZWxoY2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTA1MzEsImV4cCI6MjA2MjAyNjUzMX0.jEnB9ETeZAXDzHrmpZXRhqCE2GGUefJd033KDcXgDoU'
  }
};

module.exports = nextConfig; 