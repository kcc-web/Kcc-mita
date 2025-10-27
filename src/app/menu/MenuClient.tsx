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
import { Sparkles, Coffee, Award } from "lucide-react";

const STORAGE_KEY = "kcc:lastBeanHighlight";

export default function MenuClient() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<MenuBean | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);

  const sp = useSearchParams();
  const router = useRouter();
  const beanParam = (sp.get("bean") || "").toLowerCase().trim();

  const normalBeans = getNormalBeans();
  const specialBeans = getSpecialBeans();
  const allBeans = [...normalBeans, ...specialBeans];

  // 1) 初回マウント時に保存済みハイライトを復元（?bean が無い場合）
  useEffect(() => {
    if (beanParam) return; // URLにbeanがあれば後続のeffectで扱う
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const match = allBeans.find(
        (b) => (b.key ?? b.id.toString()).toLowerCase() === saved.toLowerCase()
      );
      if (match) {
        setHighlight(match.key ?? match.id.toString());
        // ここではダイアログは開かない（カードだけ光らせる）
      }
    } catch {
      /* no-op */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 初回のみ

  // 2) ?bean= が来たとき：一致する豆を開く＆ハイライト保存
  useEffect(() => {
    if (!beanParam) return;
    const match = allBeans.find(
      (b) =>
        b.key?.toLowerCase() === beanParam ||
        b.id?.toString().toLowerCase() === beanParam ||
        b.name?.toLowerCase().includes(beanParam)
    );
    if (match) {
      const keyStr = (match.key ?? match.id.toString());
      setActive(match);
      setHighlight(keyStr);
      try {
        localStorage.setItem(STORAGE_KEY, keyStr);
      } catch {/* no-op */}
      const timer = setTimeout(() => setOpen(true), 250);
      return () => clearTimeout(timer);
    }
  }, [beanParam, allBeans]);

  // 3) ダイアログ開閉：閉じてもハイライトは消さない（URLだけ戻す）
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      router.push("/menu", { scroll: false }); // クエリ消す
      // ハイライトは維持。active だけ少し遅らせて解除（閉じアニメ対策）
      setTimeout(() => setActive(null), 250);
    }
  };

  // カード生成
  const renderBeanCard = (b: MenuBean) => {
    const keyStr = b.key ?? b.id.toString();
    const isHL = highlight === keyStr;

    return (
      <KccCard
        key={b.id}
        title={b.name}
        description={b.description ?? ""}
        image={{ src: b.photo, alt: b.name, ratio: "16/9" }}
        className={isHL ? "ring-2 ring-pink-500 shadow-lg animate-[pulse_1.6s_ease-in-out_2]" : ""}
        onClick={() => {
          setActive(b);
          setOpen(true);
          // クリックでハイライトを上書き保存（ユーザー操作でも維持）
          try { localStorage.setItem(STORAGE_KEY, keyStr); } catch {}
          setHighlight(keyStr);
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
        <span className="text-sm text-muted-foreground">診断から選ぶこともできます</span>
        <Button asChild variant="outline" size="sm">
          <Link href="/quiz/intro">
            <Sparkles className="h-4 w-4 mr-2" />
            診断してみる
          </Link>
        </Button>
      </div>

      {/* ☕ Normal */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Coffee className="h-6 w-6 text-pink-600" />
          <h2 className="text-2xl font-bold">Normal</h2>
          <span className="text-sm text-muted-foreground">通常ライン</span>
        </div>
        <KccGrid>{normalBeans.map(renderBeanCard)}</KccGrid>
      </section>

      {/* ✨ Special */}
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
      <BeanDialog open={open} onOpenChange={handleOpenChange} bean={active} />

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
