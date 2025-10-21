// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 既存設定があればここに併記（reactStrictMode など）

  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval'", // ← drop-oil の Expression を通す“暫定”対応
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self'",
    ].join("; ");

    return [
      {
        source: "/", // intro を出すパスに限定。別パスならここを変える
        headers: [{ key: "Content-Security-Policy", value: csp }],
      },
    ];
  },
};

module.exports = nextConfig;

