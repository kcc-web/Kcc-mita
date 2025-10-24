"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Coffee, Sparkles, Clock } from "lucide-react";

export default function QuizIntroPage() {
  const router = useRouter();
  const start = () => router.push("/quiz");

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 via-white to-amber-50">
      {/* 背景装飾（やわらかブロブ） */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-pink-300 via-orange-200 to-yellow-200" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-violet-200 via-fuchsia-200 to-rose-200" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="container mx-auto px-4 md:px-6 py-10 text-center max-w-3xl"
      >
        {/* アイコン装飾 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-amber-500 shadow-lg mb-6"
        >
          <Coffee className="w-8 h-8 text-white" />
        </motion.div>

        {/* タイトル */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500">
            あなたにぴったりの
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">
            一杯を見つけよう
          </span>
        </h1>

        {/* サブタイトル */}
        <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          味覚の4軸（明るさ・質感・甘さ・香り）から、
          <br className="hidden sm:inline" />
          あなた好みのコーヒーをご提案します。
        </p>

        {/* 特徴チップ */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 backdrop-blur-sm px-4 py-2 shadow-sm">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <span className="text-sm font-medium text-gray-700">10問の簡単な質問</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 backdrop-blur-sm px-4 py-2 shadow-sm">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">所要時間 約1分</span>
          </div>
        </div>

        {/* CTAボタン */}
        <div className="mt-10">
          <button
            onClick={start}
            className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white px-10 py-4 text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-100"
            aria-label="診断を始める"
          >
            <span className="relative z-10 flex items-center gap-2">
              診断をはじめる
              <Coffee className="h-5 w-5" />
            </span>
            {/* ホバー時の光沢 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* 診断の流れ */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="rounded-xl border border-pink-100 bg-white/60 backdrop-blur-sm p-4">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-pink-100 text-pink-600 font-bold text-sm mb-2">
              1
            </div>
            <h3 className="font-semibold text-sm text-gray-800">10問に答える</h3>
            <p className="text-xs text-gray-600 mt-1">直感でサクサク回答</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white/60 backdrop-blur-sm p-4">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600 font-bold text-sm mb-2">
              2
            </div>
            <h3 className="font-semibold text-sm text-gray-800">味覚を可視化</h3>
            <p className="text-xs text-gray-600 mt-1">4本のバーで一目瞭然</p>
          </div>
          <div className="rounded-xl border border-rose-100 bg-white/60 backdrop-blur-sm p-4">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-600 font-bold text-sm mb-2">
              3
            </div>
            <h3 className="font-semibold text-sm text-gray-800">おすすめが届く</h3>
            <p className="text-xs text-gray-600 mt-1">5タイプから最適な一杯</p>
          </div>
        </div>

        {/* 注意書き */}
        <p className="mt-8 text-xs text-gray-500">
          ※ これは味覚の傾向を探る簡易診断です。性格診断ではありません。
        </p>
      </motion.div>
    </main>
  );
}