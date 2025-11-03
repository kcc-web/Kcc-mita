// src/app/quiz/QuizClient.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { QUESTIONS } from "@/lib/quiz";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/ProgressBar";
import { StepDots } from "@/components/ui/StepDots";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function QuizClient() {
  const router = useRouter();
  const total = QUESTIONS.length;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() =>
    Array<number>(total).fill(undefined as unknown as number)
  );

  // 診断開始時にハイライト情報をクリア
  useEffect(() => {
    try {
      localStorage.removeItem("kcc-quiz-highlighted-bean");
    } catch {}
  }, []);

  const q = QUESTIONS[index];
  const leftLabel = q.leftLabel ?? "全くそう思わない";
  const rightLabel = q.rightLabel ?? "とてもそう思う";
  
  // 戻るボタンのハンドラ
  const handleBack = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
    }
  }, [index]);

  const handleAnswer = useCallback(
    (value: number) => {
      const next = [...answers];
      next[index] = value;
      setAnswers(next);
      
      if (index < total - 1) {
        // 次の質問へ
        setIndex(index + 1);
      } else {
        // 全問完了 → スコア計算してアンケートへ
        const scores = {
          brightness: 0,
          texture: 0,
          sweetness: 0,
          aroma: 0
        };
        
        const counts = { EI: 0, SN: 0, TF: 0, JP: 0 };
        QUESTIONS.forEach((q, i) => {
          const ans = next[i] ?? 3;
          if (q.axis === "EI") {
            scores.brightness += ans * 20;
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
        
        const scoreStr = encodeURIComponent(JSON.stringify(scores));
        
        // アンケートページへ（スコアを引き継ぐ）
        router.push(`/quiz/survey?score=${scoreStr}`);
      }
    },
    [answers, index, total, router]
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* 進捗バー */}
      <ProgressBar value={index + 1} max={total} />

      {/* 戻るボタン（1問目以外で表示） */}
      {index > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">戻る</span>
          </Button>
        </motion.div>
      )}

      {/* 問題番号 */}
      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm mb-2">
          Question {index + 1} / {total}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold leading-relaxed">
          {q.text}
        </h1>
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
          {/* ラベル */}
          <div className="text-xs md:text-sm text-muted-foreground mb-6 max-w-sm text-center">
            <div className="flex justify-between items-center">
              <span className="text-left flex-1">{leftLabel}</span>
              <span className="mx-4">↔</span>
              <span className="text-right flex-1">{rightLabel}</span>
            </div>
          </div>

          {/* 回答ボタン（スマホ最適化） */}
          <div className="flex justify-between w-full max-w-md gap-2 md:gap-4">
            {[1, 2, 3, 4, 5].map((value) => {
              // 現在の質問の回答のみを参照
              const isSelected = answers[index] === value;
              
              return (
                <button
                  key={`q${index}-v${value}`}
                  onClick={() => handleAnswer(value)}
                  className={`flex-1 h-14 md:h-16 rounded-2xl border-2 font-bold text-base md:text-lg transition-all ${
                    isSelected
                      ? "bg-pink-600 text-white border-pink-600 scale-110 shadow-lg"
                      : "bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50"
                  }`}
                >
                  {value}
                </button>
              );
            })}
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