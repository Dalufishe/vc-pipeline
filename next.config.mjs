/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
 webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs)$/,
      use: 'raw-loader',
    });

    return config;
  },
   
};

export default nextConfig;