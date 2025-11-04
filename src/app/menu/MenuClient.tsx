"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
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

/** ===================== 設定：写真オーバーライド / 背景色 ===================== **/

// 文字列→スラッグ化（nameで照合する用の保険）
const slugify = (s?: string) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "");

// ★ ここで"正しいファイル"を強制指定（拡張子は実ファイルに合わせて変えてOK）
const PHOTO_OVERRIDES: Record<string, string> = {
  // Ethiopia Natural = ethiopia.jpg
  "ethiopia": "/beans/ethiopia.jpg",
  "ethiopia-natural": "/beans/ethiopia.jpg",

  // Ethiopia Washed = ethiopia-washed.jpg
  "ethiopia-washed": "/beans/ethiopia-washed.jpg",

  // KCC Blend = kcc-blend.jpg
  "kcc-blend": "/beans/kcc-blend.jpg",
  "kcc": "/beans/kcc-blend.jpg",
  "colombia-milan": "/beans/colombia-milan.jpg", 
};

// 背景グラデーション（任意：見た目チューニング）
const BG_GRADIENTS: Record<string, string> = {
  brazil: "from-[#E8B7FF] to-[#FFF0C7]",
  ethiopia: "from-[#FF9AA2] to-[#FFD3B5]",
  "ethiopia-natural": "from-[#FF9AA2] to-[#FFD3B5]",
  "ethiopia-washed": "from-[#A2F2F2] to-[#E0FFFA]",
  honduras: "from-[#FFE57F] to-[#FFF5D9]",
  "kcc-blend": "from-[#D97706] to-[#4B2E05]",
};

// キャッシュバスター付与（CDN/ブラウザに古いのを掴まれないように）
const safePhoto = (src?: string, v = "5") => {
  if (!src) return "/beans/placeholder.jpg";
  const enc = src.startsWith("http") ? encodeURI(src) : src;
  return enc.includes("?") ? `${enc}&v=${v}` : `${enc}?v=${v}`;
};

/** ===================== 本体 ===================== **/

export default function MenuClient() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<MenuBean | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  const sp = useSearchParams();
  const beanParam = (sp.get("bean") || "").toLowerCase().trim();

  const normalBeans = getNormalBeans();
  const specialBeans = getSpecialBeans();

  const passageBeans = normalBeans.filter(
    (b) => (b.roaster || "").toLowerCase() === "passage"
  );
  const lightRoast = normalBeans.find(
    (b) => (b.roaster || "").toLowerCase() === "mirai seeds"
  );
  const darkRoast = normalBeans.find(
    (b) => (b.roaster || "").toLowerCase() === "papelburg"
  );

  // ハイライト（URL ?bean= または localStorage）
  useEffect(() => {
    let target = beanParam;
    let shouldScroll = false;

    // URLパラメータがある場合は優先（スクロールする）
    if (target) {
      shouldScroll = true;
    } else {
      // URLパラメータがない場合はlocalStorageをチェック
      try {
        const stored = localStorage.getItem("kcc-quiz-highlighted-bean");
        if (stored) {
          target = stored.toLowerCase().trim();
          shouldScroll = true;
          // ★ ここで即座に削除（一度きりのスクロール）
          localStorage.removeItem("kcc-quiz-highlighted-bean");
        }
      } catch {}
    }

    if (!target) return;

    const all = [...normalBeans, ...specialBeans];
    const match = all.find(
      (b) =>
        b.key?.toLowerCase() === target ||
        b.id?.toString().toLowerCase() === target ||
        b.name?.toLowerCase().includes(target)
    );
    
    if (match) {
      const keyStr = match.key ?? match.id?.toString() ?? null;
      setHighlight(keyStr);
      
      // スクロールが必要な場合のみ実行
      if (shouldScroll) {
        setTimeout(() => {
          highlightRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    }
  }, [beanParam, normalBeans, specialBeans]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) setActive(null);
  };

  /** 画像パス決定：id → nameスラッグの順でオーバーライド適用 */
  const resolvePhoto = (b: MenuBean): string => {
    const idKey = (b.id ?? "").toString().toLowerCase();
    const nameKey = slugify(b.name);
    const override = PHOTO_OVERRIDES[idKey] || PHOTO_OVERRIDES[nameKey];
    return safePhoto(override || b.photo);
  };

  /** 背景決定（なければデフォルト） */
  const resolveBg = (b: MenuBean): string => {
    const idKey = (b.id ?? "").toString().toLowerCase();
    const nameKey = slugify(b.name);
    return BG_GRADIENTS[idKey] || BG_GRADIENTS[nameKey] || "from-pink-50 to-orange-50";
  };

  /** カード描画 */
  const renderBeanCard = (b: MenuBean) => {
    const keyStr = b.key ?? b.id?.toString() ?? "";
    const isHL = highlight === keyStr;
    const gradient = resolveBg(b);
    const photo = resolvePhoto(b);

    return (
      <div
        key={b.id}
        ref={isHL ? highlightRef : null}
        className={`rounded-xl transition-all duration-700 bg-gradient-to-br ${gradient} p-[1px]`}
      >
        <div className="rounded-xl bg-white/70 backdrop-blur-sm">
          <KccCard
            title={b.name}
            description={b.description ?? ""}
            image={{ src: photo, alt: b.name, ratio: "16/9" }}
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
      </div>
    );
  };

  /** 横スク用の統一幅カード */
  const UniformCard = ({ bean }: { bean: MenuBean }) => (
    <div className={`flex-shrink-0 ${CARD_W} snap-center`} key={bean.id}>
      {renderBeanCard(bean)}
    </div>
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* ヘッダー */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">KCC Mita Menu</h1>
        <p className="text-muted-foreground mt-2">三田祭 提供コーヒーとワッフルのオンラインメニュー</p>
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

        {/* PC/タブレット：グリッド */}
        <div className="hidden md:block">
          <KccGrid>
            {normalBeans.map((b) => (
              <div key={b.id}>{renderBeanCard(b)}</div>
            ))}
          </KccGrid>
        </div>

        {/* モバイル：横スク */}
        <div className="md:hidden space-y-8">
          {/* PASSAGE */}
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

              <p className="text-xs text-center text-muted-foreground mt-2">← スワイプして比較 →</p>
            </div>
          )}

          {/* 浅煎り */}
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

          {/* 深煎り */}
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

          {/* PC/タブレット */}
          <div className="hidden md:block">
            <KccGrid>
              {specialBeans.map((b) => (
                <div key={b.id}>{renderBeanCard(b)}</div>
              ))}
            </KccGrid>
          </div>

          {/* モバイル横スク */}
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
          image={{ src: safePhoto(WAFFLE.photo), alt: WAFFLE.name, ratio: "16/9" }}
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

