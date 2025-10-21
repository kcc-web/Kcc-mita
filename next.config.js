// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // dev では CSP を返さない（Next の dev クライアントが自由に動ける）
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    // ← 本番のみ、必要最小限のCSPを付与
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval'",      // LottieのExpression暫定許可（本番で必要な間だけ）
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "worker-src 'self' blob:",
    ].join("; ");

    return [
      {
        source: "/",                           // Intro を出すパスに限定
        headers: [{ key: "Content-Security-Policy", value: csp }],
      },
    ];
  },

  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@animations": path.resolve(__dirname, "src/animations"),
    };
    return config;
  },
};

module.exports = nextConfig;


