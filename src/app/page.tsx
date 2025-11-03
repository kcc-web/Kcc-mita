// src/app/page.tsx
import Link from "next/link";
import { MapPin, Clock, Sparkles } from "lucide-react";
import IntroOverlay from "@/components/hero/IntroOverlay";

export default function Home() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-14">
      {/* 🎨 フェスティバル感あふれる背景グラデーション */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* メイングラデーション（ピンク→オレンジ→アンバー） */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-orange-50 to-amber-100" />
        
        {/* 動的ブロブ */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-pink-400 via-rose-300 to-orange-300 animate-blob" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-amber-400 via-orange-300 to-yellow-300 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-fuchsia-300 via-pink-300 to-rose-300 animate-blob animation-delay-4000" />
        
        {/* 極薄グリッド（オプション） */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(0deg,transparent_24px,rgba(0,0,0,.08)_25px),linear-gradient(90deg,transparent_24px,rgba(0,0,0,.08)_25px)] bg-[length:25px_25px]"
        />
      </div>

      {/* ✨ Hero：ブランドとキャッチコピー全面表示 */}
      <section className="flex flex-col items-center text-center gap-8 mb-16">
        {/* バッジ */}
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-pink-300/40 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-xs text-pink-900 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="tracking-wide font-medium">Mita Festival 2025</span>
          </p>
        </div>

        {/* ブランド名 */}
        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Keio Coffee Club
            </span>
          </h1>
          
          {/* メインキャッチコピー（全面的に） */}
          <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-800 leading-relaxed">
            日常を彩る、一杯のコーヒー
          </p>
          
          {/* サブタイトル */}
          <p className="text-base md:text-lg text-gray-600 font-light tracking-wide">
            雑踏の中に、安らぎを
          </p>
        </div>

        {/* ダブルCTA */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/quiz/intro" className="group">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white px-8 py-4 text-lg font-medium shadow-[0_8px_30px_rgba(255,105,180,0.3)] transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_12px_40px_rgba(255,105,180,0.4)] active:scale-[.98]">
              診断をはじめる
            </span>
          </Link>
          <Link href="/menu" className="group">
            <span className="inline-flex items-center rounded-full border-2 border-gray-300 bg-white/80 backdrop-blur-sm px-8 py-4 text-lg font-medium transition-all duration-300 hover:bg-white hover:border-gray-400 hover:shadow-md active:scale-[.98]">
              メニューを見る
            </span>
          </Link>
        </div>
      </section>

      {/* 📍 開催情報カード（大きく目立つように） */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* 開催場所 */}
        <div className="relative overflow-hidden rounded-2xl border border-pink-200/40 bg-white/80 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl opacity-20 bg-gradient-to-tr from-pink-400 to-rose-400" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">開催場所</h3>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              慶應義塾大学 三田キャンパス<br />
              第一校舎 133教室
            </p>
          </div>
        </div>

        {/* 開催時間 */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-200/40 bg-white/80 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl opacity-20 bg-gradient-to-tr from-amber-400 to-orange-400" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">開催時間</h3>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              10:00 – 18:00<br />
              <span className="text-sm text-gray-600">（予定）</span>
            </p>
          </div>
        </div>
      </section>

      {/* Intro演出（初回のみ） */}
      <IntroOverlay />
    </main>
  );
}



