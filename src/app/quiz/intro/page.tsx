"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function QuizIntroPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/quiz";

  const start = () => {
    document.cookie = "kcc_quiz_intro=1; path=/; max-age=86400; samesite=lax";
    router.push(next);
  };

  return (
    <main className="relative overflow-hidden text-center bg-gradient-to-b from-pink-50 via-white to-amber-50 min-h-screen flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-4 md:px-6 py-14 md:py-20"
      >
        <p className="text-sm text-muted-foreground mb-2">MBTI × Coffee</p>
        <h1 className="mt-2 text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-amber-500">
          MBTI Coffee Diagnosis
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          あなたの性格から、ぴったりの一杯を見つけよう。<br />
          たった1分で、自分だけのコーヒープロファイルを診断します。
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={start}
            className="rounded-full bg-foreground text-background px-8 py-4 text-base font-medium hover:opacity-90 shadow-md transition-all"
          >
            診断を始める ☕️
          </button>
          <Link
            href="/menu"
            className="rounded-full border px-8 py-4 text-base hover:bg-secondary transition-all"
          >
            メニューを見る
          </Link>
        </div>
      </motion.div>
    </main>
  );
}



