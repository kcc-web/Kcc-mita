"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BEANS, WAFFLE } from "@/lib/menu";
import type { Bean } from "@/types/bean";
import KccCard from "@/components/kcc/KccCard";
import { KccGrid } from "@/components/kcc/KccGrid";
import { KccTag } from "@/components/kcc/KccTag";
import BeanDialog from "@/components/menu/BeanDialog";

export default function MenuClient() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Bean | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);

  const sp = useSearchParams();
  const beanParam = (sp.get("bean") || "").toUpperCase();

  useEffect(() => {
    if (!beanParam) return;
    const match = BEANS.find(
      (b) =>
        b.key?.toUpperCase() === beanParam ||
        b.id?.toString().toUpperCase() === beanParam
    );
    if (match) {
      setActive(match);
      setHighlight(match.key ?? match.id.toString());
      const t = setTimeout(() => setOpen(true), 200);
      return () => clearTimeout(t);
    }
  }, [beanParam]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">KCC Mita Menu</h1>
      <p className="opacity-70 mt-1">三田祭 提供コーヒーとワッフルのオンラインメニュー</p>

      {/* 上部ボタン */}
      <div className="mt-2 hidden sm:flex items-center justify-between gap-3">
        <span className="opacity-70 text-sm">診断から選ぶこともできます</span>
        <Button asChild variant="outline" size="sm">
          <Link href="/quiz">診断してみる</Link>
        </Button>
      </div>

      {/* ☕ コーヒー豆カード一覧（スマホも2列） */}
      <section className="mt-6">
        <KccGrid>
          {BEANS.map((b) => {
            const keyStr = b.key ?? b.id.toString();
            const isHL = highlight === keyStr;
            return (
              <KccCard
                key={b.id}
                title={b.name}
                // Bean型に description がない想定なら (b as any).description でフォールバック
                description={(b as any).description ?? ""}
                image={{ src: b.photo, alt: b.name, ratio: "16/9" }}
                className={isHL ? "ring-2 ring-foreground shadow-lg animate-[pulse_1.6s_ease-in-out_2]" : ""}
                onClick={() => {
                  setActive(b);
                  setOpen(true);
                }}
                footer={
                  <>
                    {b.origin && <KccTag>{b.origin}</KccTag>}
                    {b.process && <KccTag>{b.process}</KccTag>}
                    {/* roastが無い想定 → flavor をタグ表示 */}
                    {Array.isArray((b as any).flavor)
                      ? (b as any).flavor.map((f: string) => <KccTag key={f}>{f}</KccTag>)
                      : (b as any).flavor && <KccTag>{(b as any).flavor}</KccTag>}
                  </>
                }
              />
            );
          })}
        </KccGrid>
      </section>

      {/* 🧇 ワッフル表示（説明文付き） */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Waffle</h2>
        <KccCard
          title={WAFFLE.name}
          // menu.ts 側で description を追加済み前提
          description={(WAFFLE as any).description ?? ""}
          image={{ src: WAFFLE.photo, alt: WAFFLE.name, ratio: "16/9" }}
          footer={
            <>
              {WAFFLE.flavor.map((f) => (
                <KccTag key={f}>{f}</KccTag>
              ))}
            </>
          }
        />
      </section>

      {/* 詳細ダイアログ（チャートなど） */}
      <BeanDialog open={open} onOpenChange={setOpen} bean={active} />

      {/* スマホ用診断ボタン */}
      <Link
        href="/quiz"
        className="sm:hidden fixed bottom-5 right-5 rounded-full shadow-lg px-5 py-3 bg-foreground text-background font-medium"
      >
        診断する
      </Link>
    </main>
  );
}


