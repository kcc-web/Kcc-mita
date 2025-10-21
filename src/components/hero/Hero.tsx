// src/components/Hero.tsx
import Link from "next/link";
import { Clock, Sparkles } from "lucide-react";
import HandDripAnim from "./HandDripAnim";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* 背景の柔らかグラデ（軽量・高級感） */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-[#F8EDE6] via-[#FFEAD5] to-[#FFE3E3] blur-3xl opacity-70" />
        <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#FCE7F3] via-[#E9D5FF] to-[#DBEAFE] blur-3xl opacity-60" />
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 grid md:grid-cols-2 items-center gap-10">
        {/* 左：コピー&CTA */}
        <div className="text-center md:text-left">
          <p className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground bg-background/70">
            <Sparkles className="h-3.5 w-3.5" />
            Mita Festival 2025
            <span className="mx-1 text-foreground/40">|</span>
            <Clock className="h-3.5 w-3.5" />
            <span>10:00–17:00</span>
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
            Find Your Flavor ☕️
          </h1>

          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            <span className="font-medium text-foreground">4問で、あなたの一杯が見つかる。</span>{" "}
            診断結果から、三田祭で<span className="underline decoration-amber-400/70 underline-offset-2">その場で飲める</span>おすすめを案内します。
          </p>

          <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
            <Link href="/quiz/intro" className="group">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-amber-400 text-white px-6 py-3 text-base font-medium shadow-sm transition hover:scale-[1.02] active:scale-[.99]">
                診断をはじめる
              </span>
            </Link>
            <Link href="/menu" className="group">
              <span className="inline-flex items-center rounded-full border px-6 py-3 text-base font-medium transition hover:bg-muted">
                メニューを見る
              </span>
            </Link>
          </div>
        </div>

        {/* 右：アニメーション */}
        <div className="flex justify-center md:justify-end">
          <HandDripAnim />
        </div>
      </div>
    </section>
  );
}
