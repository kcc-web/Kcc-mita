// src/app/quiz/survey/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Eye, Info } from "lucide-react";

export default function SurveyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [ageGroup, setAgeGroup] = useState<string>("");
  const [seenHandDrip, setSeenHandDrip] = useState<string>("");
  const [knownSpecialty, setKnownSpecialty] = useState<string>("");

  const score = searchParams.get("score");

  useEffect(() => {
    // スコアがない場合は診断画面に戻す
    if (!score) {
      router.push("/quiz/intro");
    }
  }, [score, router]);

  const canProceed = ageGroup && seenHandDrip && knownSpecialty;

  const handleSubmit = async () => {
    if (!canProceed) return;

    // アンケート結果を保存（後でSupabaseに送信可能）
    const surveyData = {
      ageGroup,
      seenHandDrip: seenHandDrip === "yes",
      knownSpecialty,
      timestamp: new Date().toISOString(),
    };

    console.log("📊 Survey data:", surveyData);

    // localStorageに保存（オプション）
    try {
      localStorage.setItem("kcc-survey", JSON.stringify(surveyData));
    } catch {}

    // 結果ページへ
    router.push(`/result?score=${score}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-pink-50/30 px-4 py-8">
      <div className="mx-auto max-w-lg space-y-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 backdrop-blur-sm px-4 py-1.5 shadow-sm">
            <Info className="h-4 w-4 text-pink-500" />
            <span className="text-xs font-medium text-pink-900 tracking-wide">アンケート</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            最後に教えてください
          </h1>
          
          <p className="text-sm text-gray-600">
            ご協力ありがとうございます。あと3問で完了です。
          </p>
        </motion.div>

        {/* 質問カード */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Q1: 年代 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-pink-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                1. あなたの年代を教えてください
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {["10代", "20代", "30代", "40代以上"].map((age) => (
                <button
                  key={age}
                  onClick={() => setAgeGroup(age)}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                    ageGroup === age
                      ? "border-pink-500 bg-pink-50 text-pink-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* Q2: ハンドドリップ */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-pink-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                2. 目の前でハンドドリップを<br className="sm:hidden" />見たことがありますか？
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "yes", label: "はい" },
                { value: "no", label: "いいえ" }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSeenHandDrip(opt.value)}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                    seenHandDrip === opt.value
                      ? "border-pink-500 bg-pink-50 text-pink-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q3: スペシャルティコーヒー */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-pink-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                3. 「スペシャルティコーヒー」という<br className="sm:hidden" />言葉を知っていますか？
              </h2>
            </div>
            
            <div className="space-y-2">
              {[
                { value: "know", label: "知っている" },
                { value: "heard", label: "聞いたことがある" },
                { value: "unknown", label: "知らない" }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setKnownSpecialty(opt.value)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all text-left ${
                    knownSpecialty === opt.value
                      ? "border-pink-500 bg-pink-50 text-pink-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 送信ボタン */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={!canProceed}
            size="lg"
            className="w-full h-14 text-base font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:scale-105 transition-transform shadow-xl disabled:opacity-50 disabled:scale-100"
          >
            結果を見る
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </main>
  );
}