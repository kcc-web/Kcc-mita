// src/app/quiz/QuizClient.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { QUESTIONS } from "@/lib/quiz";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/ProgressBar";
import { StepDots } from "@/components/ui/StepDots";
import { computeMbtiType } from "@/lib/mbti";
import { beanForType, type MbtiType, type BeanKey } from "@/lib/resultMap";
import { useRouter } from "next/navigation";


export default function QuizClient() {
  const router = useRouter();
  const total = QUESTIONS.length;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() =>
    Array<number>(total).fill(undefined as unknown as number)
  );

  // 診断開始時（初回レンダリング時）に前回のハイライト情報をクリア
  useEffect(() => {
    try {
      localStorage.removeItem("kcc-quiz-highlighted-bean");
    } catch {
      // localStorageが使えない環境では無視
    }
  }, []);

  const q = QUESTIONS[index];
  const asAny = q as Partial <{
    leftLabel: string;
    rightLabel: string;
    left: string;
    right: string;
  }>;
  const leftLabel = asAny.leftLabel ?? asAny.left ?? "全くそう思わない"
  const rightLabel = asAny.rightLabel ?? asAny.right ??"そう思う"

 　// src/app/quiz/QuizClient.tsx の handleAnswer を修正

const handleAnswer = useCallback(
  (value: number) => {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
    
    if (index < total - 1) {
      setIndex(index + 1);
    } else {
      // ===== 直接スコア計算 =====
      const scores = {
        brightness: 0,
        texture: 0,
        sweetness: 0,
        aroma: 0
      };
      
      // 軸ごとに集計
      const counts = { EI: 0, SN: 0, TF: 0, JP: 0 };
      QUESTIONS.forEach((q, i) => {
        const ans = next[i] ?? 3;
        if (q.axis === "EI") {
          scores.brightness += ans * 20; // 1-5 → 20-100
          counts.EI++;
        }
        if (q.axis === "SN") {
          scores.texture += ans * 20;
          counts.SN++;
        }
        if (q.axis === "TF") {
          scores.sweetness += ans * 20;
          counts.TF++;
        }
        if (q.axis === "JP") {
          scores.aroma += ans * 20;
          counts.JP++;
        }
      });
      
      // 平均化
      scores.brightness = scores.brightness / Math.max(1, counts.EI);
      scores.texture = scores.texture / Math.max(1, counts.SN);
      scores.sweetness = scores.sweetness / Math.max(1, counts.TF);
      scores.aroma = scores.aroma / Math.max(1, counts.JP);
      
      console.log("📊 Final Scores:", scores);
      
      // MBTIはスキップ、スコアだけ渡す
      const scoreStr = encodeURIComponent(JSON.stringify(scores));
      router.push(`/result?score=${scoreStr}`);
    }
  },
  [answers, index, total, router]
);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* 上部進捗バー */}
      <ProgressBar value={index + 1} max={total} />

      {/* 問題部分 */}
      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm mb-2">
          Question {index + 1} / {total}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold">{q.text}</h1>
      </div>

      {/* 回答エリア */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          className="mt-10 flex flex-col items-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            {leftLabel} ←→ {rightLabel}
          </p>

          <div className="flex justify-between w-full max-w-xl">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className={`h-12 w-12 rounded-full border transition-all
                  ${
                    answers[index] === value
                      ? "bg-foreground text-background scale-110"
                      : "hover:bg-muted"
                  }`}
              >
                {value}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 下部ドット */}
      <div className="mt-10">
        <StepDots total={total} active={index} />
      </div>
    </main>
  );
}
