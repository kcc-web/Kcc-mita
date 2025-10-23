// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // dev(ローカル)ではCSPを付けない
    if (process.env.NODE_ENV !== "production") return [];

    // 本番CSP
    // ※ まず通すために 'unsafe-inline' と 'unsafe-eval' を許可
    //    余裕ができたら順に外していきましょう
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' vercel.live",
      "style-src 'self' 'unsafe-inline'",
      // 画像を Supabase Storage から出す可能性も考慮
      "img-src 'self' data: blob: https://*.supabase.co",
      // ← ここがポイント：Supabase の REST / Realtime を許可
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "frame-ancestors 'self'"
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [{ key: "Content-Security-Policy", value: csp }]
      }
    ];
  },

  // 必要なら維持：@animations エイリアス
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@animations": path.resolve(__dirname, "src/animations")
    };
    return config;
  },

  // Lintでビルドを落とさない場合は有効化
  // eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;




