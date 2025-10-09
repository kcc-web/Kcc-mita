"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { QUESTIONS } from "@/lib/quiz";
import { computeMbtiType } from "@/lib/mbti";
import { beanForType, type BeanKey, type MbtiType } from "@/lib/resultMap";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function QuizPage() {
  const total = QUESTIONS.length;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    () => Array<number>(total).fill(undefined as unknown as number)
  );
  const q = QUESTIONS[index];

  // 進捗%
  const progress = useMemo(() => Math.round(((index + 1) / total) * 100), [index, total]);

  // ナビゲーション
  const goTo = useCallback((i: number) => {
    if (i < 0 || i >= total) return;
    setIndex(i);
  }, [total]);

  const handleBack = useCallback(() => {
    if (index === 0) return;
    goTo(index - 1);
  }, [index, goTo]);

  // 回答
  const handleAnswer = (score: number) => {
    const next = [...answers];
    next[index] = score;
    setAnswers(next);

    if (index < total - 1) {
      setTimeout(() => goTo(index + 1), 220);
    } else {
      handleResult(next);
    }
  };

  // 結果
  const handleResult = (arr: number[]) => {
    const type = computeMbtiType(QUESTIONS, arr) as MbtiType;
    const bean: BeanKey = beanForType(type); // 公式マッピングを使用
    window.location.href = `/quiz/result?type=${type}&bean=${bean}`;
  };

  // キー操作（←/→/1〜5）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleBack();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (index < total - 1) goTo(index + 1);
      } else if (/^[1-5]$/.test(e.key)) {
        handleAnswer(Number(e.key));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleBack, goTo, index, total, answers]); // answers参照で最新選択にも対応

  const allAnswered = useMemo(() => answers.every((a) => typeof a === "number"), [answers]);

  return (
    <main className="max-w-lg mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} disabled={index === 0} aria-disabled={index === 0}>
          ← 戻る
        </Button>
        <span className="text-sm opacity-70">
          {index + 1} / {total}
        </span>
      </div>

      // 進捗バー（置換）
<div className="space-y-3" aria-label="進捗">
  <div
    className="h-2 w-full rounded overflow-hidden bg-muted shadow-inner"
    role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}
  >
    <motion.div
      className="h-full"
      style={{
        background:
          "linear-gradient(90deg,var(--primary) 0%, oklch(0.72 0.16 30) 60%, var(--foreground) 100%)",
      }}
      initial={{ width: "0%" }}
      animate={{ width: `${progress}%` }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    />
  </div>

  {/* ステップドット：サイズ小さめ/角丸 */}
  <div className="grid grid-cols-10 gap-1.5">
    {Array.from({ length: total }).map((_, i) => {
      const answered = typeof answers[i] === "number";
      const isActive = i === index;
      return (
        <button
          key={i}
          onClick={() => goTo(i)}
          className={[
            "h-2.5 rounded-full transition-all",
            answered ? "bg-foreground/90" : "bg-muted",
            isActive && "outline outline-2 outline-offset-2 outline-foreground scale-[1.05]",
            !isActive && "hover:opacity-90",
          ].filter(Boolean).join(" ")}
          aria-label={`設問 ${i + 1} へ`}
        />
      );
    })}
  </div>
</div>


      {/* 質問 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.22 }}
          className="space-y-8 text-center"
        >
          <h2 className="text-xl font-semibold">
            Q{index + 1}. {q.text}
          </h2>

          {/* 1〜5ボタン（置換） */}
<div className="flex justify-between gap-2">
  {[1, 2, 3, 4, 5].map((v) => {
    const active = answers[index] === v;
    return (
      <Button
        key={v}
        variant={active ? "default" : "secondary"}
        className={[
          "w-12 h-12 text-lg rounded-2xl transition-all",
          active ? "shadow-lg scale-[1.03]" : "opacity-90 hover:opacity-100",
        ].join(" ")}
        onClick={() => handleAnswer(v)}
        aria-pressed={active}
      >
        {v}
      </Button>
    );
  })}
</div>


          <p className="text-sm text-muted-foreground">
            1 = まったく当てはまらない / 5 = とても当てはまる
          </p>
        </motion.div>
      </AnimatePresence>

      {/* 結果へ */}
      <div className="pt-2">
        <Button
          className="w-full"
          onClick={() => handleResult(answers)}
          disabled={!allAnswered}
          aria-disabled={!allAnswered}
          variant="outline"
        >
          結果を見る
        </Button>
      </div>
    </main>
  );
}
