"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getNormalBeans, getSpecialBeans, WAFFLE, type MenuBean } from "@/lib/menu";
import KccCard from "@/components/kcc/KccCard";
import { KccGrid } from "@/components/kcc/KccGrid";
import { KccTag } from "@/components/kcc/KccTag";
import BeanDialog from "@/components/menu/BeanDialog";
import { Sparkles, Coffee, Award, Flame, Sun } from "lucide-react";

export default function MenuClient() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<MenuBean | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);

  const sp = useSearchParams();
  const router = useRouter();
  const beanParam = (sp.get("bean") || "").toLowerCase().trim();

  const normalBeans = getNormalBeans();
  const specialBeans = getSpecialBeans();

  // PASSAGE COFFEEの3種を抽出
  const passageBeans = normalBeans.filter((b) => b.roaster === "Passage");
  
  // 浅煎り（Mirai Seeds）と深煎り（Papelburg）を抽出
  const lightRoast = normalBeans.find((b) => b.roaster === "Mirai Seeds");
  const darkRoast = normalBeans.find((b) => b.roaster === "Papelburg");

  useEffect(() => {
    if (!beanParam) return;

    const allBeans = [...normalBeans, ...specialBeans];
    const match = allBeans.find(
      (b) =>
        b.key?.toLowerCase() === beanParam ||
        b.id?.toString().toLowerCase() === beanParam ||
        b.name?.toLowerCase().includes(beanParam)
    );

    if (match) {
      setActive(match);
      setHighlight(match.key ?? match.id.toString());
      const timer = setTimeout(() => setOpen(true), 300);
      return () => clearTimeout(timer);
    }
  }, [beanParam, normalBeans, specialBeans]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      router.push("/menu", { scroll: false });
      setTimeout(() => {
        setHighlight(null);
        setActive(null);
      }, 300);
    }
  };

  // カード生成関数（すべて16:9で統一）
  const renderBeanCard = (b: MenuBean) => {
    const keyStr = b.key ?? b.id.toString();
    const isHL = highlight === keyStr;

    return (
      <KccCard
        key={b.id}
        title={b.name}
        description={b.description ?? ""}
        image={{ src: b.photo, alt: b.name, ratio: "16/9" }}
        className={
          isHL
            ? "ring-2 ring-pink-500 shadow-lg animate-[pulse_1.6s_ease-in-out_2]"
            : ""
        }
        onClick={() => {
          setActive(b);
          setOpen(true);
        }}
        footer={
          <div className="flex flex-wrap items-center gap-2">
            {b.roaster && (
              <KccTag>
                <Coffee className="h-3 w-3 mr-1 inline" />
                {b.roaster}
              </KccTag>
            )}
            {b.roastLevel && <KccTag>{b.roastLevel}</KccTag>}
            {b.price && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 text-xs font-semibold">
                {b.price}
              </span>
            )}
            {b.stock === "limited" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                <Award className="h-3 w-3 mr-1" />
                数量限定
              </span>
            )}
            {b.flavor.slice(0, 2).map((f) => (
              <KccTag key={f}>{f}</KccTag>
            ))}
          </div>
        }
      />
    );
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* ヘッダー */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">KCC Mita Menu</h1>
        <p className="text-muted-foreground mt-2">
          三田祭 提供コーヒーとワッフルのオンラインメニュー
        </p>
      </header>

      {/* 上部ボタン（PC） */}
      <div className="mb-6 hidden sm:flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          診断から選ぶこともできます
        </span>
        <Button asChild variant="outline" size="sm">
          <Link href="/quiz/intro">
            <Sparkles className="h-4 w-4 mr-2" />
            診断してみる
          </Link>
        </Button>
      </div>

      {/* ☕ Normal（通常ライン） */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Coffee className="h-6 w-6 text-pink-600" />
          <h2 className="text-2xl font-bold">Normal</h2>
          <span className="text-sm text-muted-foreground">通常ライン - 全て¥700</span>
        </div>

        {/* === PC・タブレット：グリッド表示 === */}
        <div className="hidden md:block">
          <KccGrid>{normalBeans.map((b) => renderBeanCard(b))}</KccGrid>
        </div>

        {/* === モバイル：セクション別レイアウト === */}
        <div className="md:hidden space-y-8">
          
          {/* 1. PASSAGE COFFEE - 横スクロール */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-orange-100 border border-pink-200">
                <Coffee className="h-4 w-4 text-pink-600" />
                <span className="text-sm font-bold text-pink-900">PASSAGE COFFEE</span>
                <span className="text-xs text-pink-700 bg-white/80 px-2 py-0.5 rounded-full">3種</span>
              </div>
            </div>
            
            {/* 横スクロールコンテナ */}
            <div className="relative -mx-4 px-4">
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
                {passageBeans.map((b) => (
                  <div key={b.id} className="flex-shrink-0 w-[280px] snap-center">
                    {renderBeanCard(b)}
                  </div>
                ))}
              </div>
              
              {/* スクロールヒント */}
              <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-2">
              ← スワイプして比較 →
            </p>
          </div>

          {/* 2. 浅煎り - フィーチャードカード */}
          {lightRoast && (
            <div className="relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-4 shadow-lg">
              {/* 背景装飾 */}
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-yellow-400 to-orange-400" />
              
              <div className="relative">
                {/* ラベル */}
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 shadow-sm">
                    <Sun className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-bold text-amber-900">浅煎り</span>
                  </div>
                  <span className="text-xs font-medium text-amber-800 bg-white/80 px-3 py-1 rounded-full">
                    Fruity & Bright
                  </span>
                </div>

                {/* カード */}
                {renderBeanCard(lightRoast)}
                
                {/* 説明 */}
                <div className="mt-3 p-3 rounded-lg bg-white/60 backdrop-blur-sm">
                  <p className="text-xs text-amber-900 leading-relaxed">
                    <Award className="h-3 w-3 inline mr-1" />
                    トロピカルフルーツのような華やかな香りと、長く続く甘い余韻が特徴の特別な一杯。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. 深煎り - フィーチャードカード */}
          {darkRoast && (
            <div className="relative overflow-hidden rounded-2xl border-2 border-stone-300 bg-gradient-to-br from-stone-100 via-neutral-100 to-zinc-100 p-4 shadow-lg">
              {/* 背景装飾 */}
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl opacity-15 bg-gradient-to-br from-stone-600 to-zinc-700" />
              
              <div className="relative">
                {/* ラベル */}
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 shadow-sm">
                    <Flame className="h-4 w-4 text-stone-700" />
                    <span className="text-sm font-bold text-stone-900">深煎り</span>
                  </div>
                  <span className="text-xs font-medium text-stone-800 bg-white/80 px-3 py-1 rounded-full">
                    Rich & Full Body
                  </span>
                </div>

                {/* カード */}
                {renderBeanCard(darkRoast)}
                
                {/* 説明 */}
                <div className="mt-3 p-3 rounded-lg bg-white/60 backdrop-blur-sm">
                  <p className="text-xs text-stone-900 leading-relaxed">
                    <Coffee className="h-3 w-3 inline mr-1" />
                    カカオとカラメルの香ばしさ。力強いコクと安心感のある、KCCオリジナルブレンド。
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ✨ Special（限定ライン） */}
      {specialBeans.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl font-bold">Special</h2>
            <span className="text-sm text-muted-foreground">数量限定 - ¥1,000</span>
          </div>
          <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-yellow-50/30 p-4 mb-4">
            <p className="text-sm text-amber-900 flex items-center gap-2">
              <Award className="h-4 w-4" />
              限定ロットのスペシャルティコーヒー。無くなり次第終了です。
            </p>
          </div>
          <KccGrid>{specialBeans.map((b) => renderBeanCard(b))}</KccGrid>
        </section>
      )}

      {/* 🧇 ワッフル */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Waffle</h2>
        <KccCard
          title={WAFFLE.name}
          description={WAFFLE.description ?? ""}
          image={{ src: WAFFLE.photo, alt: WAFFLE.name, ratio: "16/9" }}
          footer={
            <>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 text-xs font-semibold">
                {WAFFLE.price}
              </span>
              {WAFFLE.flavor.map((f) => (
                <KccTag key={f}>{f}</KccTag>
              ))}
            </>
          }
        />
      </section>

      {/* 詳細ダイアログ */}
      <BeanDialog open={open} onOpenChange={handleOpenChange} bean={active} />

      {/* スマホ用診断ボタン */}
      <Link
        href="/quiz/intro"
        className="sm:hidden fixed bottom-5 right-5 rounded-full shadow-xl px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium flex items-center gap-2 z-10"
      >
        <Sparkles className="h-4 w-4" />
        診断する
      </Link>

      {/* スクロールバー非表示のスタイル */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}