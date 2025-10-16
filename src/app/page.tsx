// src/app/page.tsx
import Link from "next/link";
import { Coffee, Utensils, MapPin, Clock, Sparkles } from "lucide-react";
import IntroOverlay from "@/components/ui/IntroOverlay ";

export default function Home() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-12">
      {/* 背景アクセント */}
      <div className="pointer-events-none absolute -z-10 inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-15 bg-gradient-to-tr from-pink-300 via-orange-200 to-yellow-200" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full blur-3xl opacity-10 bg-gradient-to-tr from-violet-200 via-fuchsia-200 to-rose-200" />
      </div>

      {/* Hero */}
      <section className="mb-8">
        <p className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> Mita Festival 2025
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">KCC Mita 2025</h1>
        <p className="text-muted-foreground mt-2">QRから来たら、まずは診断かメニューへ👇</p>
      </section>

      {/* 2大CTAカード */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
        <Link href="/quiz/intro" className="group">
          <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
            <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-pink-300 via-rose-300 to-amber-300 group-hover:opacity-35" />
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
          <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
            <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-amber-200 via-orange-200 to-yellow-200 group-hover:opacity-30" />
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

      {/* 情報ブロック */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-2">開催場所</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" /> 慶應義塾大学 三田キャンパス
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-2">開催時間</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" /> 10:00–17:00（予定）
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-2">コンセプト</h3>
          <p className="text-sm text-muted-foreground leading-6">
            日常を彩る、<span className="bg-gradient-to-r from-rose-400 to-amber-500 bg-clip-text text-transparent">一杯のコーヒー</span>。
            ふとした瞬間に寄り添う香りと温度を、あなたへ。
          </p>
        </div>
      </section>

      {/* イントロ：初回だけ表示（/?intro=1 で強制表示可） */}
      <IntroOverlay />
    </main>
  );
}
