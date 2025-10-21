// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // dev(ローカル)ではCSPを付けない
    if (process.env.NODE_ENV !== "production") return [];

    // 本番CSP（まず通すために 'unsafe-inline' と 'unsafe-eval' を許可）
    // ＊表現式なしのLottie JSONに切り替えられたら 'unsafe-eval' は外せます
    // ＊inline script を消せたら 'unsafe-inline' も外せます
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self' https://vitals.vercel-insights.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "frame-ancestors 'self'"
    ].join("; ");

    return [
      {
        // ✅ 全ページに適用
        source: "/:path*",
        headers: [{ key: "Content-Security-Policy", value: csp }]
      }
    ];
  },

  // 省略可：@animations エイリアスを使っているなら維持
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@animations": path.resolve(__dirname, "src/animations")
    };
    return config;
  },

  // もし “ESLintでビルド落ち” を避けたいなら有効化（Flat Configに移行したら外してOK）
  // eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;



