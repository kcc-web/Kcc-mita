// src/app/result/ResultClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FlavorBar from "@/components/ui/FlavorBar";
import { pickBeanType, type Scores, type Axes, BEAN_TYPES } from "@/lib/resultMap";
import * as MenuModule from "@/lib/menu";
import { useMemo, useEffect, useState } from "react";
import { Coffee, Sparkles, TrendingUp, Heart, MapPin, Award, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

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
  const characterSrc = `/characters/${picked.key}.jpg`;

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

      {/* キャラクター画像 + コーヒー豆カードの統合セクション */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* キャラクター画像（スマホで上に配置） */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 via-white to-amber-50 shadow-xl border-2 border-pink-100"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none z-10" />
            <Image
              src={characterSrc}
              alt={`${picked.typeName}のキャラクター`}
              fill
              className="object-contain p-6 md:p-8"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            
            {/* タイプ名バッジ */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-pink-200 px-4 py-2 shadow-lg">
                <span className="text-sm font-bold bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">
                  {picked.typeName}
                </span>
              </div>
            </div>
          </motion.div>

          {/* コーヒー豆情報カード */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col"
          >
            {/* コーヒー画像（ラベル付き） */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-lg mb-4 group">
              <Image
                src={photoSrc}
                alt={picked.beanName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* グラデーションオーバーレイ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* 「おすすめのコーヒー」ラベル */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute top-4 left-4 z-10"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-pink-200 px-3 py-1.5 shadow-lg">
                  <Coffee className="h-4 w-4 text-pink-600" />
                  <span className="text-sm font-bold text-gray-900">おすすめのコーヒー</span>
                </div>
              </motion.div>
            </div>

            {/* コーヒー情報 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex-1 space-y-4"
            >
              <div className="rounded-2xl border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50/30 p-4 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {picked.beanName}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {picked.desc}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {picked.roast && (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium"
                    >
                      {picked.roast}
                    </motion.span>
                  )}
                  {picked.price && (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.3 }}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-medium"
                    >
                      {picked.price}
                    </motion.span>
                  )}
                  {picked.tags.map((t, i) => (
                    <motion.span
                      key={t}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-xs text-gray-600 text-center"
              >
                メニューページで、この豆がハイライト表示されます
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== 教室での体験セクション（修正版） ========== */}
      <section className="mb-6 rounded-2xl border-2 border-pink-300 bg-gradient-to-br from-pink-50 via-white to-orange-50 p-4 md:p-6 shadow-xl relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-pink-400 to-rose-400 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* ヘッダー */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 backdrop-blur-sm px-4 py-1.5 shadow-sm">
              <Sparkles className="h-4 w-4 text-pink-500" />
              <span className="text-xs font-medium text-pink-900 tracking-wide">Your Next Step</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              教室で体験できる<br className="sm:hidden" />4つのこと
            </h2>
            
            <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
              診断結果はあくまで目安です。<br />
              実際の<strong className="text-pink-700">香り・味・スタッフのアドバイス</strong>で、
              あなたに本当に合う一杯を見つけましょう。
            </p>
          </div>

          {/* 4つの体験カード */}
          <div className="space-y-4">
            {/* 体験① フレーバーカードをもらう */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-purple-100 p-2.5 flex-shrink-0">
                  <Award className="h-5 w-5 md:h-6 md:w-6 text-purple-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base md:text-lg mb-2 text-gray-900">
                    ① コーヒー豆のフレーバーカードをもらう
                  </h3>
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    おすすめの<strong className="text-purple-700">{picked.beanName}</strong>など、
                    各コーヒー豆ごとの<strong>フレーバーカード</strong>をご用意しています。
                    味の特徴や香りのヒントが記載されており、お持ち帰りいただけます。
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 体験② サークル員からの豆提案 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2.5 flex-shrink-0">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base md:text-lg mb-2 text-gray-900">
                    ② サークル員があなたに合う豆を提案します
                  </h3>
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    診断タイプをベースに、コーヒー好きのサークル員が
                    <strong className="text-blue-700">「こんな人にはこの豆がおすすめ」</strong>と
                    パーソナルなアドバイスをします。
                  </p>
                  
                  {/* サークル員のコメント風吹き出し */}
                  <div className="mt-3 relative">
                    <div className="bg-blue-100 rounded-lg p-3 text-xs italic text-blue-900">
                      <span className="not-italic font-bold">🎓 KCCメンバーより：</span><br />
                      「診断はあくまでスタート地点。実際に話してみると、意外な好みが見つかることも多いです。
                      ぜひ気軽に話しかけてください！」
                    </div>
                    <div className="absolute -bottom-2 left-6 w-4 h-4 bg-blue-100 rotate-45 transform origin-top-left"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 体験③ 豆の香りを直接嗅ぐ */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-amber-100 p-2.5 flex-shrink-0">
                  <Coffee className="h-5 w-5 md:h-6 md:w-6 text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base md:text-lg mb-2 text-gray-900">
                    ③ 焙煎したての豆の香りを嗅ぐ
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-amber-700">{picked.beanName}</strong>を含む全6種類の豆をご用意。
                    画面越しでは伝わらない、<strong>本物の香り</strong>を直接お確かめいただけます。
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 体験④ 実際に飲んで答え合わせ */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-rose-100 p-2.5 flex-shrink-0">
                  <Heart className="h-5 w-5 md:h-6 md:w-6 text-rose-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base md:text-lg mb-2 text-gray-900">
                    ④ 気に入ったら、その場でドリップした一杯を
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    香りで「これだ！」と思ったら、プロが淹れる一杯をその場で味わえます。
                    診断結果との<strong className="text-rose-700">「答え合わせ」</strong>をお楽しみください。
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 会場情報（コンパクト版） */}
          <div className="mt-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 p-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900 mb-1">会場</p>
                  <p className="text-gray-700">慶應義塾大学 三田キャンパス</p>
                  <p className="text-gray-700">第一校舎 133教室</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900 mb-1">時間</p>
                  <p className="text-gray-700">10:00 - 18:00</p>
                  <p className="text-xs text-gray-600 mt-1">
                    ※ 混雑状況はページ上部で確認できます
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* オプション：スクリーンショット推奨 */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              💡 Tip: タイプ名「<strong>{picked.typeName}</strong>」を覚えておくとスムーズです
            </p>
          </div>
        </div>
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
            left="Deep"
            right="Bright"
            value={scores.brightness}
            gradient="brightness"
          />
          
          <FlavorBar
            title="Texture（質感）"
            left="sharp"
            right="soft"
            value={scores.texture}
            gradient="texture"
          />
          
          <FlavorBar
            title="Sweetness（甘さ）"
            left="Clean"
            right="Sweet"
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