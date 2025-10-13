// src/app/quiz/intro/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const INTRO_COOKIE = "kcc_quiz_intro";

export default function QuizIntroPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/quiz";

  const start = () => {
    document.cookie = `${INTRO_COOKIE}=1; path=/; max-age=86400; samesite=lax`;
    router.push(next);
  };

  return (
    <main className="relative overflow-hidden">
      <section className="container mx-auto px-4 md:px-6 py-14 md:py-20">
        <p className="text-sm text-muted-foreground">MBTI × Coffee</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight">
          MBTI Coffee Diagnosis
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
          あなたの性格傾向から、ぴったりのコーヒーを提案します。10問・約1分。
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={start}
            className="inline-flex items-center justify-center rounded-xl bg-foreground text-background px-5 py-3 text-sm font-medium hover:opacity-90"
          >
            診断を始める
          </button>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm hover:bg-secondary"
          >
            メニューを見る
          </Link>
        </div>
      </section>
    </main>
  );
}


