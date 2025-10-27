"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getNormalBeans,
  getSpecialBeans,
  WAFFLE,
  type MenuBean,
} from "@/lib/menu";
import KccCard from "@/components/kcc/KccCard";
import { KccGrid } from "@/components/kcc/KccGrid";
import { KccTag } from "@/components/kcc/KccTag";
import BeanDialog from "@/components/menu/BeanDialog";
import { Sparkles, Coffee, Award, Flame, Sun } from "lucide-react";

const CARD_W = "w-[280px]";

export default function MenuClient() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<MenuBean | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  const sp = useSearchParams();
  const router = useRouter();
  const beanParam = (sp.get("bean") || "").toLowerCase().trim();

  const normalBeans = getNormalBeans();
  const specialBeans = getSpecialBeans();

  // --- 抽出：PASSAGE 3種 / 浅煎り（Mirai Seeds） / 深煎り（Papelburg） ---
  const passageBeans = normalBeans.filter((b) => (b.roaster || "").toLowerCase() === "passage");
  const lightRoast = normalBeans.find((b) => (b.roaster || "").toLowerCase() === "mirai seeds");
  const darkRoast = normalBeans.find((b) => (b.roaster || "").toLowerCase() === "papelburg");

  // URLクエリ (?bean=) で指定があればハイライト、なければlocalStorageから読み取り
  useEffect(() => {
    let targetBeanId = beanParam;
    
    // URLパラメータがない場合、localStorageから読み取り
    if (!targetBeanId) {
      try {
        const stored = localStorage.getItem("kcc-quiz-highlighted-bean");
        if (stored) {
          targetBeanId = stored.toLowerCase().trim();
        }
      } catch {
        // localStorageが使えない環境では無視
      }
    }
    
    if (!targetBeanId) {
      setHighlight(null);
      return;
    }
    const all = [...normalBeans, ...specialBeans];
    const match = all.find(
      (b) =>
        (b.key && b.key.toLowerCase() === targetBeanId) ||
        (b.id && b.id.toString().toLowerCase() === targetBeanId) ||
        (b.name && b.name.toLowerCase().includes(targetBeanId))
    );
    if (match) {
      const keyStr = match.key ?? match.id.toString();
      setHighlight(keyStr);
      
      // スクロール（少し遅延させて確実に要素が描画されてから）
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "center" 
        });
      }, 300);
    }
  }, [beanParam, normalBeans, specialBeans]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setActive(null);
    }
  };

  // 共通カード（16:9／幅280px）
  const UniformCard = ({ bean }: { bean: MenuBean }) => (
    <div 
      className={`flex-shrink-0 ${CARD_W} snap-center`}
      ref={highlight === (bean.key ?? bean.id.toString()) ? highlightRef : null}
    >
      {renderBeanCard(bean)}
    </div>
  );

  // 汎用カード（16:9）
  const renderBeanCard = (b: MenuBean) => {
    const keyStr = b.key ?? b.id?.toString() ?? "";
    const isHL = highlight === keyStr;

    return (
      <div 
        className={`transition-all duration-700 ${
          isHL 
            ? "" 
            : ""
        }`}
      >
        <KccCard
          key={b.id}
          title={b.name}
          description={b.description ?? ""}
          image={{ src: b.photo, alt: b.name, ratio: "16/9" }}
          className={
            isHL
              ? "shadow-[0_0_0_2px_rgba(251,207,232,0.4),0_8px_24px_-4px_rgba(244,114,182,0.15)]"
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
              {b.flavor?.slice(0, 2).map((f) => (
                <KccTag key={f}>{f}</KccTag>
              ))}
            </div>
          }
        />
      </div>
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
        <span className="text-sm text-muted-foreground">診断から選ぶこともできます</span>
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

        {/* PC/タブレット：従来グリッド */}
        <div className="hidden md:block">
          <KccGrid>{normalBeans.map((b) => renderBeanCard(b))}</KccGrid>
        </div>

        {/* モバイル：PASSAGE横スク → 浅/深を同サイズカードで表示 */}
        <div className="md:hidden space-y-8">
          {/* 1) PASSAGE（横スクロール、カード幅統一） */}
          {passageBeans.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-orange-100 border border-pink-200">
                  <Coffee className="h-4 w-4 text-pink-600" />
                  <span className="text-sm font-bold text-pink-900">PASSAGE COFFEE</span>
                  <span className="text-xs text-pink-700 bg-white/80 px-2 py-0.5 rounded-full">
                    {passageBeans.length}種
                  </span>
                </div>
              </div>

              <div className="relative -mx-4 px-4">
                <div
                  className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {passageBeans.map((b) => (
                    <UniformCard key={b.id} bean={b} />
                  ))}
                </div>
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
              </div>

              <p className="text-xs text-center text-muted-foreground mt-2">
                ← スワイプして比較 →
              </p>
            </div>
          )}

          {/* 2) 浅煎り（同サイズカード） */}
          {lightRoast && (
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                  <Sun className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-900">浅煎り</span>
                </div>
              </div>
              <div className="relative -mx-4 px-4">
                <div
                  className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <UniformCard bean={lightRoast} />
                </div>
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
              </div>
            </div>
          )}

          {/* 3) 深煎り（同サイズカード） */}
          {darkRoast && (
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200">
                  <Flame className="h-4 w-4 text-stone-700" />
                  <span className="text-sm font-bold text-stone-900">深煎り</span>
                </div>
              </div>
              <div className="relative -mx-4 px-4">
                <div
                  className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <UniformCard bean={darkRoast} />
                </div>
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
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

          {/* PC/タブレット：従来グリッド */}
          <div className="hidden md:block">
            <KccGrid>{specialBeans.map((b) => renderBeanCard(b))}</KccGrid>
          </div>

          {/* モバイル：PASSAGEと同サイズ（横スク） */}
          <div className="md:hidden relative -mx-4 px-4">
            <div
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {specialBeans.map((b) => (
                <UniformCard key={b.id} bean={b} />
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>
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

      {/* スクロールバー非表示 */}
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
