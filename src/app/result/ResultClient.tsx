// src/app/result/ResultClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FlavorBar from "@/components/ui/FlavorBar";
import { pickBeanType, type Scores, type Axes } from "@/lib/resultMap";
import * as MenuModule from "@/lib/menu";
import { useMemo, useEffect, useState } from "react";
import { Coffee, Sparkles, TrendingUp, Heart, MapPin, Award, Clock } from "lucide-react";

type Initial = { type: string | null; bean: string | null; score: string | null };

// ユーティリティ
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
  const urlScores = parseScores(initial.score);
  if (urlScores) return urlScores;

  try {
    const raw = localStorage.getItem("kcc-quiz-scores");
    const ls = parseScores(raw ?? undefined);
    if (ls) return ls;
  } catch {}

  return { brightness: 60, texture: 55, sweetness: 60, aroma: 60 };
};

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

  useEffect(() => {
    if (picked?.beanId) {
      try {
        localStorage.setItem("kcc-quiz-highlighted-bean", picked.beanId);
      } catch {}
    }
  }, [picked?.beanId]);

  return (
    <main className="container mx-auto max-w-4xl px-4 py-6 md:py-12">
      {/* ヘッダー */}
      <header className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 backdrop-blur-sm px-4 py-1.5 shadow-sm">
          <Sparkles className="h-4 w-4 text-pink-500" />
          <span className="text-xs font-medium text-pink-900 tracking-wide">Your Coffee Type</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            {picked.typeName}
          </span>
          <span className="block text-lg md:text-2xl font-normal text-gray-700 mt-2">
            {picked.typeNameJa}
          </span>
        </h1>

        <p className="text-sm md:text-lg text-gray-600 font-light">
          {picked.tagline}
        </p>
      </header>

      {/* メインCTA（スマホ最適化） */}
      <section className="mb-6 rounded-2xl border-2 border-pink-300 bg-gradient-to-br from-pink-50 via-white to-orange-50 p-4 md:p-6 shadow-xl relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-pink-400 to-rose-400 pointer-events-none" />

        <div className="relative z-10 text-center space-y-4">
          {/* タイトル */}
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">
            <span className="text-pink-600">{picked.beanName}</span> の<br className="sm:hidden" />
            本物の香りを嗅いでみませんか？
          </h2>

          {/* 説明文 */}
          <div className="max-w-xl mx-auto space-y-2 text-sm md:text-base">
            <p className="text-gray-700 leading-relaxed">
              画面越しでは伝わらない、<strong className="text-pink-700">豆そのものの香り</strong>が待っています。
            </p>
            
            <p className="text-gray-600 leading-relaxed text-xs md:text-sm">
              焙煎したての豆を手に取り、鼻を近づけた瞬間―<br />
              フローラル、フルーティ、ナッツ…<br />
              言葉では表現しきれない複雑な香りに包まれます。
            </p>

            <p className="text-gray-600 leading-relaxed text-xs md:text-sm">
              そして、もし気に入ったら。<br />
              <strong className="text-amber-700">その場でドリップした一杯</strong>を。<br />
              あなたのタイプに合った最高の味わいを体験してください。
            </p>
          </div>

          {/* 2つの体験カード */}
          <div className="grid grid-cols-2 gap-3 mt-4 max-w-md mx-auto">
            <div className="rounded-xl bg-white/80 backdrop-blur-sm p-3 shadow-md border border-pink-100">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center mx-auto mb-2">
                <Coffee className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">香りを嗅ぐ</h3>
              <p className="text-xs text-gray-600 leading-snug">
                焙煎直後の豆を直接。<br />
                現地でしか体験できません。
              </p>
            </div>

            <div className="rounded-xl bg-white/80 backdrop-blur-sm p-3 shadow-md border border-amber-100">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mx-auto mb-2">
                <Coffee className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">実際に飲む</h3>
              <p className="text-xs text-gray-600 leading-snug">
                プロが淹れる一杯。<br />
                あなたのタイプの"答え合わせ"。
              </p>
            </div>
          </div>

          {/* 会場情報（最初から開いた状態） */}
          <div className="mt-5 text-left max-w-md mx-auto">
            <div className="p-4 rounded-xl bg-white/80 border border-pink-200 text-sm space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1">会場</p>
                  <p className="text-gray-700">慶應義塾大学 三田キャンパス</p>
                  <p className="text-gray-700">第一校舎 133教室</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1">時間</p>
                  <p className="text-gray-700">10:00 - 18:00</p>
                  <p className="text-xs text-gray-600 mt-1">
                    ※ 混雑状況はページ上部で確認できます
                  </p>
                </div>
              </div>

              {/* 鳥瞰図スペース */}
              <div className="pt-3 border-t">
                <p className="text-xs font-semibold text-gray-900 mb-2">アクセスマップ</p>
                <div className="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                  <p className="text-sm text-gray-500">
                    ※ ここに鳥瞰図が入ります
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* コーヒー画像 */}
      <section className="mb-6">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-xl">
          <Image
            src={photoSrc}
            alt={picked.beanName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
          />
        </div>
      </section>

      {/* おすすめのコーヒー */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Coffee className="h-5 w-5 text-pink-600" />
          <h2 className="text-xl font-bold">あなたにおすすめのコーヒー</h2>
        </div>

        <div className="rounded-2xl border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50/30 p-4 md:p-5 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {picked.beanName}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
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

        <p className="text-xs text-gray-600 mt-2 text-center">
          メニューページで、この豆がハイライト表示されます
        </p>
      </section>

      {/* 味覚プロファイル */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-pink-600" />
          <h2 className="text-xl font-bold">あなたの味覚プロファイル</h2>
        </div>

        <div className="rounded-2xl border bg-white p-4 md:p-5 shadow-sm space-y-4">
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

      {/* このタイプの特徴（折りたたみ可能に） */}
      <details className="mb-6 rounded-2xl border bg-gradient-to-br from-white to-pink-50/20 shadow-sm overflow-hidden">
        <summary className="cursor-pointer p-4 md:p-5 flex items-center justify-between hover:bg-pink-50/50 transition">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <h2 className="text-xl font-bold">このタイプの特徴</h2>
          </div>
          <span className="text-sm text-gray-500">▼</span>
        </summary>
        
        <div className="px-4 md:px-5 pb-5 space-y-4">
          <div className="border-l-4 border-pink-500 pl-4">
            <p className="text-base md:text-lg font-serif text-gray-800 leading-relaxed">
              {picked.tagline}
            </p>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {picked.detailedDesc}
          </p>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Coffee className="h-4 w-4 text-pink-600" />
                味わいの傾向
              </h4>
              <ul className="text-xs md:text-sm text-gray-600 space-y-1.5 list-disc pl-5">
                <li>明るさ：{Math.round(scores.brightness)}%</li>
                <li>質感：{Math.round(scores.texture)}%</li>
                <li>甘さ：{Math.round(scores.sweetness)}%</li>
                <li>香り：{Math.round(scores.aroma)}%</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-600" />
                おすすめの楽しみ方
              </h4>
              <ul className="text-xs md:text-sm text-gray-600 space-y-1.5 list-disc pl-5">
                <li>抽出温度：{scores.brightness >= 60 ? "やや低温" : "やや高温"}</li>
                <li>グラインド：{scores.texture >= 60 ? "中細挽き" : "中挽き"}</li>
                <li>ペアリング：{picked.tags.includes("Fruity") ? "ベリー系" : "バター系"}</li>
              </ul>
            </div>
          </div>
        </div>
      </details>

      {/* CTA */}
      <section className="flex flex-col gap-3 justify-center">
        <Button asChild size="lg" className="h-12 px-6 text-base w-full">
          <Link href={`/menu?bean=${picked.beanId}`}>メニューを見る</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base w-full">
          <Link href="/quiz/intro">もう一度診断する</Link>
        </Button>
      </section>

      <p className="mt-6 text-center text-xs text-gray-500">
        ※これは味覚の傾向を探る簡易診断です。学術的な性格診断ではありません。
      </p>
    </main>
  );
}