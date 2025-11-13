"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { Sparkles, Coffee, Award, Flame, Sun, Package } from "lucide-react";

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
//   ※ kcc blend / ethiopia washed の取り違い対策を維持
const PHOTO_OVERRIDES: Record<string, string> = {
  // Ethiopia Natural = ethiopia.jpg
  "ethiopia": "/beans/ethiopia.jpg",
  "ethiopia-natural": "/beans/ethiopia.jpg",

  // Ethiopia Washed = ethiopia-washed.jpg
  "ethiopia-washed": "/beans/ethiopia-washed.jpg",

  // KCC Blend = kcc-blend.jpg
  "kcc-blend": "/beans/kcc-blend.jpg",
  "kcc": "/beans/kcc-blend.jpg",

  // Special
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

// idをキー化（未定義対策）
const beanKey = (b: MenuBean) =>
  String(b.id ?? b.key ?? slugify(b.name) ?? Math.random().toString(36));

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

    if (target) {
      shouldScroll = true;
    } else {
      try {
        const stored = localStorage.getItem("kcc-quiz-highlighted-bean");
        if (stored) {
          target = stored.toLowerCase().trim();
          shouldScroll = true;
          localStorage.removeItem("kcc-quiz-highlighted-bean");
        }
      } catch {}
    }

    if (!target) return;

    const all = [...normalBeans, ...specialBeans];
    const match = all.find(
      (b) =>
        b.key?.toLowerCase() === target ||
        String(b.id ?? "").toLowerCase() === target ||
        (b.name ?? "").toLowerCase().includes(target)
    );

    if (match) {
      const keyStr = match.key ?? String(match.id ?? "");
      setHighlight(keyStr);

      if (shouldScroll) {
        setTimeout(() => {
          highlightRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
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
    const idKey = String(b.id ?? "").toLowerCase();
    const nameKey = slugify(b.name);
    const override = PHOTO_OVERRIDES[idKey] || PHOTO_OVERRIDES[nameKey];
    return safePhoto(override || b.photo);
  };

  /** 背景決定（なければデフォルト） */
  const resolveBg = (b: MenuBean): string => {
    const idKey = String(b.id ?? "").toLowerCase();
    const nameKey = slugify(b.name);
    return (
      BG_GRADIENTS[idKey] ||
      BG_GRADIENTS[nameKey] ||
      "from-pink-50 to-orange-50"
    );
  };

  /** カード描画 */
  const renderBeanCard = (b: MenuBean) => {
    const keyStr = b.key ?? String(b.id ?? "");
    const isHL = highlight === keyStr;
    const gradient = resolveBg(b);
    const photo = resolvePhoto(b);

    return (
      <div
        key={beanKey(b)}
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
                  <KccTag key={`${beanKey(b)}-${f}`}>{f}</KccTag>
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
    <div className={`flex-shrink-0 ${CARD_W} snap-center`} key={beanKey(bean)}>
      {renderBeanCard(bean)}
    </div>
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      {/* ヘッダー */}
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          KCC Mita Menu
        </h1>
        <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
          三田祭 提供コーヒーとワッフルのオンラインメニュー
        </p>
      </header>

      {/* 🎁 セットメニュー（最優先表示） */}
      <section className="mb-8 md:mb-10">
        <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 md:p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  お得なセット
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-amber-700 font-medium">
                単品より¥50お得！人気No.1の組み合わせ
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm md:text-base font-bold shadow-md">
                ¥850
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white/70 rounded-lg p-3">
              <div className="text-sm md:text-base font-bold text-gray-800 mb-2">
                セット内容
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Coffee className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs sm:text-sm text-gray-700">
                    <span className="font-medium">コーヒー 1杯</span>
                    <span className="block text-[11px] sm:text-xs text-gray-500 mt-0.5">
                      Normal全6種類から選択
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5 flex-shrink-0">🧇</span>
                  <div className="text-xs sm:text-sm text-gray-700">
                    <span className="font-medium">ワッフル ハーフ1種類</span>
                    <span className="block text-[11px] sm:text-xs text-gray-500 mt-0.5">
                      4つのフレーバーから選択
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2">
              <Award className="h-3 w-3 text-amber-600" />
              <p className="text-[11px] sm:text-xs text-amber-800">
                ※ Special（Colombia Milan NG ¥1,000）はセット対象外
              </p>
            </div>
          </div>
        </div>

        {/* スマホ用の診断誘導（セット直下） */}
        <div className="mt-4 md:hidden">
          <Link href="/quiz/intro" className="block">
            <div className="rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-500" />
                <span className="text-sm font-medium text-gray-700">
                  どれを選ぶか迷ったら？
                </span>
              </div>
              <span className="text-xs font-bold text-pink-600">診断する →</span>
            </div>
          </Link>
        </div>
      </section>

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
      <section className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <Coffee className="h-5 w-5 md:h-6 md:w-6 text-pink-600" />
          <h2 className="text-xl sm:text-2xl font-bold">Normal</h2>
          <span className="text-xs sm:text-sm text-muted-foreground">全て¥700</span>
        </div>

        {/* PC/タブレット：グリッド */}
        <div className="hidden md:block">
          <KccGrid>
            {normalBeans.map((b) => (
              <div key={beanKey(b)}>{renderBeanCard(b)}</div>
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
                  <span className="text-sm font-bold text-pink-900">
                    PASSAGE COFFEE
                  </span>
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
                    <UniformCard key={beanKey(b)} bean={b} />
                  ))}
                </div>
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
              </div>

              <p className="text-xs text-center text-muted-foreground mt-2">
                ← スワイプして比較 →
              </p>
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
        <section className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-bold">Special</h2>
            <span className="text-xs sm:text-sm text-muted-foreground">
              限定 ¥1,000
            </span>
          </div>

          <div className="rounded-xl md:rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-yellow-50/30 p-3 md:p-4 mb-3 md:mb-4">
            <p className="text-xs sm:text-sm text-amber-900 flex items-center gap-2">
              <Award className="h-3.5 w-3.5 md:h-4 md:w-4" />
              限定ロットのスペシャルティコーヒー。無くなり次第終了です。
            </p>
          </div>

          {/* PC/タブレット */}
          <div className="hidden md:block">
            <KccGrid>
              {specialBeans.map((b) => (
                <div key={beanKey(b)}>{renderBeanCard(b)}</div>
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
                <UniformCard key={beanKey(b)} bean={b} />
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>
        </section>
      )}

      {/* 🧇 ワッフル */}
      <section className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl md:text-2xl">🧇</span>
          <h2 className="text-xl sm:text-2xl font-bold">Waffle</h2>
          <span className="text-xs sm:text-sm text-muted-foreground">単品 ¥400</span>
        </div>

        {/* ワッフルカード（スマホ最適化） */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {/* ワッフル画像 */}
          <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
            <Image
              src={safePhoto("/beans/waffle.jpg")}
              alt="ベルギーワッフル"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-pink-800 text-sm font-bold shadow-lg">
                単品 ¥400
              </span>
            </div>
          </div>

          {/* ワッフル詳細 */}
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              ベルギーワッフル
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
              外はカリッと、中はふんわり。バターの芳醇な香りとはちみつの優しい甘さが、
              コーヒーの味わいを引き立てます。
            </p>

            <div className="space-y-3">
              {/* ハーフサイズ説明 */}
              <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-pink-600 text-sm">✨</span>
                  <span className="text-sm font-semibold text-gray-800">
                    ハーフサイズ × 2種類
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-600">
                  お好きなフレーバーを2つお選びいただけます
                </p>
              </div>

              {/* フレーバー選択 */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  選べるフレーバー：
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2">
                    <span className="text-base">🥞</span>
                    <span className="text-xs sm:text-sm font-medium">プレーン</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2">
                    <span className="text-base">🍵</span>
                    <span className="text-xs sm:text-sm font-medium">抹茶</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2">
                    <span className="text-base">🍫</span>
                    <span className="text-xs sm:text-sm font-medium">チョコ</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2">
                    <span className="text-base">🍓</span>
                    <span className="text-xs sm:text-sm font-medium">ストロベリー</span>
                  </div>
                </div>
              </div>

              {/* セット誘導 */}
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-amber-600" />
                    <span className="text-xs sm:text-sm font-medium text-amber-800">
                      セットでハーフ１種類＋コーヒー1杯
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-600">
                    コーヒーと一緒で¥850
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 詳細ダイアログ */}
      <BeanDialog open={open} onOpenChange={handleOpenChange} bean={active} />

      {/* スマホ用診断ボタン（フローティング） */}
      <Link
        href="/quiz/intro"
        className="sm:hidden fixed bottom-4 right-4 rounded-full shadow-xl px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium flex items-center gap-1.5 z-10 text-sm"
      >
        <Sparkles className="h-3.5 w-3.5" />
        診断
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
