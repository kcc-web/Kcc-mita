"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function QuizIntroPage() {
  const router = useRouter();
  const start = () => router.push("/quiz"); // ← 固定

  return (
    <main className="relative min-h-screen flex flex-col justify-center bg-gradient-to-b from-pink-50 via-white to-amber-50 text-center">
      {/* やわらかブロブ背景（装飾） */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-pink-300 via-orange-200 to-yellow-200" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-violet-200 via-fuchsia-200 to-rose-200" />

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto px-4 md:px-6 py-14 md:py-20"
      >
        <p className="text-xs md:text-sm text-muted-foreground">MBTI風 × Coffee</p>

        <h1 className="mt-2 text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-amber-500">
        ~KCC~ Coffee Diagnosis 
        </h1>

        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          あなたの嗜好バランス（明るさ・質感・甘さ・香り）から、
          ぴったりの一杯をおすすめします。所要時間は約1分。
        </p>

        {/* CTA：スタートのみ（Menuは削除） */}
        <div className="mt-10">
          <button
            onClick={start}
            className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 py-4 text-base font-medium shadow-md transition-all hover:opacity-90 active:opacity-95"
            aria-label="診断を始める"
          >
            診断を始める ☕️
          </button>
        </div>

        {/* 手順の小さなチップ（任意・視認性UP） */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground">
            10問に回答
          </span>
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground">
            4本のバーで可視化
          </span>
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground">
            5タイプから提案
          </span>
        </div>

        {/* 注意書き */}
        <p className="mt-6 text-xs text-muted-foreground">
          ※これは嗜好の参考指標です。学術的な性格診断ではありません。
        </p>
      </motion.div>
    </main>
  );
}
