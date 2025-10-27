"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FlavorBar from "@/components/ui/FlavorBar";
import { pickBeanType, type Scores, type Axes } from "@/lib/resultMap";
import * as MenuModule from "@/lib/menu";
import { useMemo, useEffect, useState } from "react";
import { Coffee, Sparkles, TrendingUp, Heart } from "lucide-react";

type Initial = { type: string | null; bean: string | null; score: string | null };

// --- ユーティリティ ---
const parseScores = (s?: string | null): Scores | null => {
  if (!s) return null;
  try {
    const obj = JSON.parse(decodeURIComponent(s));
    const keys: Axes[] = ["brightness", "texture", "sweetness", "aroma"];
    const out: any = {};
    for (const k of keys) {
      const v = Number(obj?.[k]);
      out[k] = Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 50;
    }
    return out as Scores;
  } catch {
    return null;
  }
};

const ensureScores = (initial: Initial): Scores => {
  // 1) URL score JSON
  const urlScores = parseScores(initial.score);
  if (urlScores) return urlScores;

  // 2) localStorage
  try {
    const raw = localStorage.getItem("kcc-quiz-scores");
    const ls = parseScores(raw ?? undefined);
    if (ls) return ls;
  } catch {}

  // 3) fallback
  return { brightness: 60, texture: 55, sweetness: 60, aroma: 60 };
};

// 画像解決
function normalizeLocal(src?: string): string | null {
  if (!src || typeof src !== "string") return null;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return src;
  return `/${src.replace(/^\.?\/*/, "")}`;
}

function resolveImage(beanId: string | undefined, fallbackImage: string): string {
  const mod = MenuModule as any;
  const src = (mod.BEANS ?? mod.MENU ?? mod.default ?? []) as any[];
  const key = String(beanId ?? "").toLowerCase();
  const hit =
    src.find((b) => String(b?.id ?? "").toLowerCase().includes(key)) ||
    src.find((b) => String(b?.name ?? "").toLowerCase().includes(key));
  const fromData = hit?.photo || hit?.image;
  return normalizeLocal(fromData) || normalizeLocal(fallbackImage) || "/beans/placeholder.jpg";
}

export default function ResultClient({ initial }: { initial: Initial }) {
  const [scores, setScores] = useState<Scores>(() => ensureScores(initial));
  
  useEffect(() => {
    setScores(ensureScores(initial));
  }, [initial.score, initial.type]);

  const picked = useMemo(() => pickBeanType(scores), [scores]);
  const photoSrc = resolveImage(picked.beanId, picked.fallbackImage);

  // 診断結果の豆IDをlocalStorageに保存（次回診断まで維持）
  useEffect(() => {
    if (picked?.beanId) {
      try {
        localStorage.setItem("kcc-quiz-highlighted-bean", picked.beanId);
      } catch {
        // localStorageが使えない環境では無視
      }
    }
  }, [picked?.beanId]);

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      {/* 🎨 Hero: タイプ名（MBTI風） */}
      <header className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 backdrop-blur-sm px-4 py-1.5 shadow-sm">
          <Sparkles className="h-4 w-4 text-pink-500" />
          <span className="text-xs font-medium text-pink-900 tracking-wide">Your Coffee Type</span>
        </div>

        {/* タイプ名（英語 + 日本語） */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            {picked.typeName}
          </span>
          <span className="block text-2xl md:text-3xl font-normal text-gray-700 mt-2">
            {picked.typeNameJa}
          </span>
        </h1>

        {/* キャッチコピー */}
        <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto">
          {picked.tagline}
        </p>
      </header>

      {/* 📸 コーヒー画像 */}
      <section className="mb-10">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-xl">
          <Image
            src={photoSrc}
            alt={picked.beanName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
            priority
          />
        </div>
      </section>

      {/* 🔘 おすすめのコーヒー（メニューへ案内） */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Coffee className="h-5 w-5 text-pink-600" />
          <h2 className="text-2xl font-bold">あなたにおすすめのコーヒー</h2>
        </div>

        <div className="rounded-2xl border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50/30 p-6 shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {picked.beanName}
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-3">
                {picked.desc}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {picked.roast && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                    {picked.roast}
                  </span>
                )}
                {picked.price && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-medium">
                    {picked.price}
                  </span>
                )}
                {picked.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-3 text-center">
          メニューページで、この豆がハイライト表示されます
        </p>
      </section>

      {/* 📊 味覚バロメーター */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-pink-600" />
          <h2 className="text-2xl font-bold">あなたの味覚プロファイル</h2>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-5">
          <FlavorBar
            title="Brightness（明るさ）"
            left="Bright"
            right="Deep"
            value={scores.brightness}
            gradient="brightness"
          />
          <FlavorBar
            title="Texture（質感）"
            left="Soft"
            right="Sharp"
            value={scores.texture}
            gradient="texture"
          />
          <FlavorBar
            title="Sweetness（甘さ）"
            left="Sweet"
            right="Clean"
            value={scores.sweetness}
            gradient="sweetness"
          />
          <FlavorBar
            title="Aroma（香り）"
            left="Floral"
            right="Fruity"
            value={scores.aroma}
            gradient="aroma"
          />
        </div>
      </section>

      {/* 💬 このタイプの特徴（詳細） */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-pink-600" />
          <h2 className="text-2xl font-bold">このタイプの特徴</h2>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-white to-pink-50/20 p-6 md:p-8 shadow-sm space-y-6">
          {/* メインキャッチコピー */}
          <div className="border-l-4 border-pink-500 pl-4">
            <p className="text-xl md:text-2xl font-serif text-gray-800 leading-relaxed">
              {picked.tagline}
            </p>
          </div>

          {/* 詳細説明 */}
          <div className="prose prose-pink max-w-none">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {picked.detailedDesc}
            </p>
          </div>

          {/* 味わいメモ */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Coffee className="h-4 w-4 text-pink-600" />
                味わいの傾向
              </h4>
              <ul className="text-sm text-gray-600 space-y-1.5 list-disc pl-5">
                <li>
                  明るさ：{scores.brightness}%{" "}
                  {scores.brightness >= 60 ? "（すっきり明るい印象）" : "（落ち着いたトーン）"}
                </li>
                <li>
                  質感：{scores.texture}%{" "}
                  {scores.texture >= 60 ? "（キレのある口当たり）" : "（やわらかな口当たり）"}
                </li>
                <li>
                  甘さ：{scores.sweetness}%{" "}
                  {scores.sweetness >= 60 ? "（甘みが持続）" : "（クリアで後味すっきり）"}
                </li>
                <li>
                  香り：{scores.aroma}%{" "}
                  {scores.aroma >= 60 ? "（香りが広がる）" : "（香りは控えめ）"}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-600" />
                おすすめの楽しみ方
              </h4>
              <ul className="text-sm text-gray-600 space-y-1.5 list-disc pl-5">
                <li>
                  抽出温度：
                  {scores.brightness >= 60 ? "やや低温（88-90℃）" : "やや高温（92-94℃）"}
                </li>
                <li>
                  グラインド：
                  {scores.texture >= 60 ? "中細挽き（キレ重視）" : "中挽き（まろやか重視）"}
                </li>
                <li>
                  ペアリング：
                  {picked.tags.includes("Fruity")
                    ? "ベリー系スイーツ"
                    : picked.tags.includes("Floral")
                    ? "バター香る焼き菓子"
                    : "ビター系チョコ"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🔄 CTA */}
      <section className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="h-12 px-8 text-base">
          <Link href={`/menu?bean=${picked.beanId}`}>メニューを見る</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
          <Link href="/quiz/intro">もう一度診断する</Link>
        </Button>
      </section>

      {/* 注意書き */}
      <p className="mt-8 text-center text-xs text-gray-500">
        ※これは味覚の傾向を探る簡易診断です。学術的な性格診断ではありません。
      </p>
    </main>
  );
}

