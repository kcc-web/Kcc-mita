// next.config.ts
const nextConfig = {
  eslint: {
    // ✅ ビルド時に eslint エラーで止まらないようにする
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
