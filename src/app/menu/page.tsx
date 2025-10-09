// /src/app/menu/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { BEANS } from "@/lib/menu";
import type { Bean } from "@/types/bean";
import MenuCard from "@/components/menu/MenuCard";
import BeanDialog from "@/components/menu/BeanDialog";

export default function MenuPage() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Bean | null>(null);

  // ハイライト対象（stringに統一：bean.key か id.toString()）
  const [highlight, setHighlight] = useState<string | null>(null);

  const sp = useSearchParams();
  const beanParam = (sp.get("bean") || "").toUpperCase(); // URLの ?bean= を取得

  // 初回レンダ後に該当豆を探して自動オープン
  useEffect(() => {
    if (!beanParam) return;

    const match = BEANS.find(
      (b) => b.key?.toUpperCase() === beanParam || b.id?.toString().toUpperCase() === beanParam
    );

    if (match) {
      setActive(match);
      setHighlight(match.key ?? match.id.toString()); // ← stringに統一
      const t = setTimeout(() => setOpen(true), 200); // 少し遅らせて自然に開く
      return () => clearTimeout(t);
    }
  }, [beanParam]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">KCC Mita Menu</h1>
      <p className="opacity-70 mt-1">三田祭 提供コーヒーとワッフルのオンラインメニュー</p>

      {/* PC向け：タイトル下のCTA（診断へ） */}
      <div className="mt-2 hidden sm:flex items-center justify-between gap-3">
        <span className="opacity-70 text-sm">診断から選ぶこともできます</span>
        <Button asChild variant="outline" size="sm">
          <Link href="/quiz">診断してみる</Link>
        </Button>
      </div>

      {/* 一覧カード */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {BEANS.map((b) => {
          const keyStr = b.key ?? b.id.toString(); // 比較用キー（string）
          const isHL = highlight === keyStr;
          return (
            <MenuCard
              key={b.id}
              bean={b}
              onOpen={() => {
                setActive(b);
                setOpen(true);
              }}
              // ハイライト：光らせる & ちょいパルス
              className={
                isHL
                  ? "ring-2 ring-foreground shadow-lg animate-[pulse_1.6s_ease-in-out_2]"
                  : ""
              }
            />
          );
        })}
      </section>

      {/* モーダル */}
      <BeanDialog open={open} onOpenChange={setOpen} bean={active} />

      {/* スマホ向け：右下浮遊CTA（診断へ） */}
      <Link
        href="/quiz"
        className="sm:hidden fixed bottom-5 right-5 rounded-full shadow-lg px-5 py-3
                   bg-foreground text-background font-medium"
      >
        診断する
      </Link>
    </main>
  );
}




