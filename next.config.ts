// next.config.ts
import type { NextConfig } from "next";

type WebpackFn = NonNullable<NextConfig["webpack"]>;

const withAnalyzer: WebpackFn = (config, _opts) => {
  const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
  (config.plugins ??= []).push(
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "./analyze.html",
      openAnalyzer: false,
    })
  );
  return config;
};

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",
  },
  swcMinify: true,
  reactStrictMode: true,
  webpack:
    process.env.ANALYZE === "true" ? withAnalyzer : undefined,
};

export default nextConfig;





