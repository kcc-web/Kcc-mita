"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getNormalBeans, getSpecialBeans, WAFFLE, type MenuBean } from "@/lib/menu";
import KccCard from "@/components/kcc/KccCard";
import { KccGrid } from "@/components/kcc/KccGrid";
import { KccTag } from "@/components/kcc/KccTag";
import BeanDialog from "@/components/menu/BeanDialog";
import { Sparkles, Coffee, Award } from "lucide-react";

export default function MenuClient() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<MenuBean | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);

  const sp = useSearchParams();
  const beanParam = (sp.get("bean") || "").toLowerCase().trim();

  const normalBeans = getNormalBeans();
  const specialBeans = getSpecialBeans();

  useEffect(() => {
    if (!beanParam) return;

    // URLパラメータから該当豆を探す
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

      // 少し遅延してダイアログを開く
      const timer = setTimeout(() => setOpen(true), 300);
      return () => clearTimeout(timer);
    }
  }, [beanParam, normalBeans, specialBeans]);

  // カード生成関数
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
            {/* 焙煎者 */}
            {b.roaster && (
              <KccTag>
                <Coffee className="h-3 w-3 mr-1 inline" />
                {b.roaster}
              </KccTag>
            )}
            {/* 焙煎度 */}
            {b.roastLevel && <KccTag>{b.roastLevel}</KccTag>}
            {/* 価格 */}
            {b.price && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 text-xs font-semibold">
                {b.price}
              </span>
            )}
            {/* 在庫状況 */}
            {b.stock === "limited" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                <Award className="h-3 w-3 mr-1" />
                数量限定
              </span>
            )}
            {/* フレーバータグ */}
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
          <span className="text-sm text-muted-foreground">通常ライン</span>
        </div>
        <KccGrid>{normalBeans.map(renderBeanCard)}</KccGrid>
      </section>

      {/* ✨ Special（限定ライン） */}
      {specialBeans.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl font-bold">Special</h2>
            <span className="text-sm text-muted-foreground">数量限定</span>
          </div>
          <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-yellow-50/30 p-4 mb-4">
            <p className="text-sm text-amber-900 flex items-center gap-2">
              <Award className="h-4 w-4" />
              限定ロットのスペシャルティコーヒー。無くなり次第終了です。
            </p>
          </div>
          <KccGrid>{specialBeans.map(renderBeanCard)}</KccGrid>
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
      <BeanDialog open={open} onOpenChange={setOpen} bean={active} />

      {/* スマホ用診断ボタン */}
      <Link
        href="/quiz/intro"
        className="sm:hidden fixed bottom-5 right-5 rounded-full shadow-xl px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium flex items-center gap-2"
      >
        <Sparkles className="h-4 w-4" />
        診断する
      </Link>
    </main>
  );
}