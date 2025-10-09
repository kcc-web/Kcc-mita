// src/app/menu/MenuClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { BEANS, WAFFLE } from "@/lib/menu";
import type { Bean } from "@/types/bean";
import MenuCard from "@/components/menu/MenuCard";
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
      (b) => b.key?.toUpperCase() === beanParam || b.id?.toString().toUpperCase() === beanParam
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

      {/* PC向け：タイトル下CTA */}
      <div className="mt-2 hidden sm:flex items-center justify-between gap-3">
        <span className="opacity-70 text-sm">診断から選ぶこともできます</span>
        <Button asChild variant="outline" size="sm">
          <Link href="/quiz">診断してみる</Link>
        </Button>
      </div>

      {/* 一覧カード */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {BEANS.map((b) => {
          const keyStr = b.key ?? b.id.toString();
          const isHL = highlight === keyStr;
          return (
            <MenuCard
              key={b.id}
              bean={b}
              onOpen={() => {
                setActive(b);
                setOpen(true);
              }}
              className={isHL ? "ring-2 ring-foreground shadow-lg animate-[pulse_1.6s_ease-in-out_2]" : ""}
            />
          );
        })}
      </section>

      {/* ここから追加：ワッフル */}
      <section className="mt-10">
        <div className="flex items-center gap-2 mb-3">
          {/* lucide-react の Utensils を既に import 済なら使ってOK（未 import なら削除して大丈夫） */}
          {/* <Utensils className="h-4 w-4" /> */}
          <h2 className="text-lg font-semibold">Waffle</h2>
          <span className="text-sm text-muted-foreground">コーヒーと相性の良い焼き菓子</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="hover:shadow-md transition-shadow rounded-lg overflow-hidden border">
            <div className="relative w-full h-40 bg-muted">
              {/* next/image を使っている前提 */}
              <img
                src={WAFFLE.photo}
                alt={WAFFLE.name}
                className="object-cover w-full h-full"
              />
              {/* next/image を使いたい場合は上を以下に置き換え */}
              {/* <Image src={WAFFLE.photo} alt={WAFFLE.name} fill className="object-cover" /> */}
            </div>
            <div className="p-3 space-y-2">
              <div className="text-base font-medium">{WAFFLE.name}</div>
              {Array.isArray(WAFFLE.flavor) && WAFFLE.flavor.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {WAFFLE.flavor.map((f: string) => (
                    <span key={f} className="text-xs rounded-full border px-2 py-0.5">
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <BeanDialog open={open} onOpenChange={setOpen} bean={active} />

      {/* SP向け：右下浮遊CTA */}
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
