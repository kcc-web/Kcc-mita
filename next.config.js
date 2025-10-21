// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // ✅ 開発時（localhost）はCSPを付けない：NextのdevクライアントやHMRが動くように
    if (process.env.NODE_ENV !== "production") return [];

    // ✅ 本番のみ付与（Lottie JSONに After Effects の expression が残っている想定）
    // 表現式なしJSONに切り替えたら 'unsafe-eval' を消してOK
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "worker-src 'self' blob:"
    ].join("; ");

    return [
      {
        source: "/",
        headers: [{ key: "Content-Security-Policy", value: csp }]
      }
    ];
  },

  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@animations": path.resolve(__dirname, "src/animations")
    };
    return config;
  }
};

module.exports = nextConfig;


