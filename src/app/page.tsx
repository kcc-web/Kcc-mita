// src/app/page.tsx
import Link from "next/link";
import { MapPin, Clock, Sparkles, Coffee, Utensils } from "lucide-react";
import IntroOverlay from "@/components/hero/IntroOverlay";

export default function Home() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-14">
      {/* 背景：夜の余韻 → 朝の気配（軽量グロー＋極薄グリッド） */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-amber-200 via-rose-200 to-pink-200" />
        <div className="absolute -bottom-28 -right-20 h-96 w-96 rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-rose-200 via-fuchsia-200 to-indigo-200" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(0deg,transparent_24px,rgba(0,0,0,.14)_25px),linear-gradient(90deg,transparent_24px,rgba(0,0,0,.14)_25px)] bg-[length:25px_25px]"
        />
      </div>

      {/* Hero：中央寄せシンプル */}
      <section className="flex flex-col items-center text-center gap-6 mb-12">
        <div>
          <p className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] text-muted-foreground bg-background/70 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="tracking-wide">Mita Festival 2025</span>
            <span className="mx-1 text-foreground/30">•</span>
            <Clock className="h-3.5 w-3.5" />
            <span>10:00–17:00</span>
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
              KCC Mita 2025
            </span>
          </h1>

          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            <span className="font-medium text-foreground">10問で、あなたの一杯が見つかる。</span>{" "}
            診断結果から、三田祭で
            <span className="underline decoration-amber-400/70 underline-offset-2">その場で飲める</span>
            おすすめへ。
          </p>

          {/* ダブルCTA（主従明確） */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/quiz/intro" className="group">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-amber-400 text-white px-6 py-3 text-base font-medium shadow-[0_6px_24px_rgba(255,105,180,0.25)] transition-transform group-hover:scale-[1.02] active:scale-[.99]">
                診断をはじめる
              </span>
            </Link>
            <Link href="/menu" className="group">
              <span className="inline-flex items-center rounded-full border px-6 py-3 text-base font-medium backdrop-blur-sm transition-colors hover:bg-muted/50">
                メニューを見る
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2大CTAカード：ガラス調で統一 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
        <Link href="/quiz/intro" className="group">
          <div className="relative overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-xl p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
            <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-pink-300 via-rose-300 to-amber-300 group-hover:opacity-40" />
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow">
                <Coffee className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold leading-tight">MBTI診断へ</h2>
                <p className="text-sm text-muted-foreground truncate">あなたに合う一杯を1分で。</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/menu" className="group">
          <div className="relative overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-xl p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
            <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-amber-200 via-orange-200 to-yellow-200 group-hover:opacity-35" />
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border">
                <Utensils className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold leading-tight">Menu</h2>
                <p className="text-sm text-muted-foreground truncate">豆のラインナップを見る。</p>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* 情報ブロック：上品に */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl">
        <div className="rounded-2xl border bg-background/60 backdrop-blur-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> 開催場所
          </h3>
          <p className="text-sm text-muted-foreground">慶應義塾大学 三田キャンパス</p>
        </div>
        <div className="rounded-2xl border bg-background/60 backdrop-blur-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" /> 開催時間
          </h3>
          <p className="text-sm text-muted-foreground">10:00–17:00（予定）</p>
        </div>
        <div className="rounded-2xl border bg-background/60 backdrop-blur-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-2">コンセプト</h3>
          <p className="text-sm text-muted-foreground leading-6">
            日常を彩る、<span className="bg-gradient-to-r from-rose-400 to-amber-500 bg-clip-text text-transparent">一杯のコーヒー</span>。
            ふとした瞬間に寄り添う香りと温度を、あなたへ。
          </p>
        </div>
      </section>

      {/* Intro：最初だけ5秒演出 */}
      <IntroOverlay />
    </main>
  );
}

