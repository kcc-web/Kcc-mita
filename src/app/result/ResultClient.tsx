"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FlavorBar from "@/components/ui/FlavorBar";
import BeanCard from "@/components/result/BeanCard";
import { pickBeanType, type Scores, type Axes } from "@/lib/resultMap";
import * as MenuModule from "@/lib/menu";
import { useMemo, useEffect, useState } from "react";

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

  // 3) fallback（タイプがあるならそれ風の仮値）
  const t = (initial.type ?? "").toUpperCase();
  if (t.startsWith("EN")) return { brightness: 72, texture: 60, sweetness: 58, aroma: 68 };
  if (t.startsWith("IN")) return { brightness: 55, texture: 48, sweetness: 64, aroma: 52 };
  if (t.startsWith("ES")) return { brightness: 50, texture: 72, sweetness: 42, aroma: 66 };
  if (t.startsWith("IS")) return { brightness: 45, texture: 52, sweetness: 70, aroma: 50 };
  return { brightness: 60, texture: 55, sweetness: 60, aroma: 60 };
};

// BEANS(photo)優先 → fallbackImage
function normalizeLocal(src?: string): string | null {
   if (!src || typeof src !== "string") return null;
   if (src.startsWith("http")) return src;
   if (src.startsWith("/")) return src;
   return `/${src.replace(/^\.?\/*/, "")}`;
 }
 // BEANS(photo/image)優先 → fallbackImage → placeholder
 function resolveImage(beanId: string | number | undefined, fallbackImage: string): string {
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
  useEffect(() => { setScores(ensureScores(initial)); }, [initial.score, initial.type]);

  const picked = useMemo(() => pickBeanType(scores), [scores]);
  const photoSrc = resolveImage(picked.key, picked.fallbackImage);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      {/* Hero */}
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          あなたのコーヒータイプは{" "}
          <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            {picked.typeName}
          </span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          4つの味覚バランスから、あなたに近い一杯を選びました。
        </p>
      </header>

      

        {/* 右：バー4本 */}
        <div className="space-y-4">
          <FlavorBar title="Brightness" left="Bright" right="Deep" value={scores.brightness} gradient="brightness" />
          <FlavorBar title="Texture" left="Soft" right="Sharp" value={scores.texture} gradient="texture" />
          <FlavorBar title="Sweetness" left="Sweet" right="Clean" value={scores.sweetness} gradient="sweetness" />
          <FlavorBar title="Aroma" left="Floral" right="Fruity" value={scores.aroma} gradient="aroma" />
        </div>

      {/* 結果カード */}
      <div className="mt-8">
        <BeanCard
        　imageSrc={photoSrc}
          typeName={picked.typeName}
          beanName={picked.beanName}
          desc={picked.desc}
          tags={picked.tags}
        />
      </div>
      {/* 詳しい説明（テキストカード） */}
<div className="mt-6 rounded-2xl border bg-card text-card-foreground p-6 shadow-sm">
  <h3 className="text-lg font-semibold mb-2">この一杯のプロフィール</h3>
  <p className="text-sm md:text-base text-muted-foreground leading-7 mb-4">
    {picked.desc}
  </p>

  <div className="grid md:grid-cols-2 gap-4">
    {/* 味わいメモ */}
    <div>
      <h4 className="text-sm font-medium mb-1">味わいメモ</h4>
      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
        <li>明るさ（Brightness）：{scores.brightness}% — {scores.brightness >= 60 ? "すっきりとした印象" : "落ち着いたトーン"}</li>
        <li>質感（Texture）：{scores.texture}% — {scores.texture >= 60 ? "キレのある口当たり" : "やわらかな口当たり"}</li>
        <li>甘さ（Sweetness）：{scores.sweetness}% — {scores.sweetness >= 60 ? "甘みが心地よく持続" : "クリアで後味すっきり"}</li>
        <li>香り（Aroma）：{scores.aroma}% — {scores.aroma >= 60 ? "香りがふわっと広がる" : "香りは控えめで透明感"}</li>
      </ul>
    </div>

    {/* 抽出ヒント＆ペアリング */}
    <div>
      <h4 className="text-sm font-medium mb-1">おすすめの楽しみ方</h4>
      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
        <li>抽出：{scores.brightness >= 60 ? "やや低温 88–90℃・短め抽出" : "やや高温 92–94℃・しっかり抽出"} が相性◎</li>
        <li>グラインド：{scores.texture >= 60 ? "中細挽き（キレ重視）" : "中挽き（まろやか重視）"}</li>
        <li>ペアリング：{picked.tags.includes("Fruity") ? "ベリー系スイーツ" : picked.tags.includes("Floral") ? "バター香る焼き菓子" : "ビター系チョコ"} が好相性</li>
      </ul>
    </div>
  </div>
</div>

      {/* CTA */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button asChild className="h-11 rounded-xl shadow-sm"><Link href="/menu">メニューを見る</Link></Button>
        <Button asChild variant="outline" className="h-11 rounded-xl"><Link href="/quiz/intro">もう一度診断</Link></Button>
      </div>

      {/* 注意書き（誠実性確保） */}
      <p className="mt-4 text-xs text-muted-foreground">
        ※これは嗜好の参考指標です。学術的な性格診断ではありません。
      </p>
    </main>
  );
}

