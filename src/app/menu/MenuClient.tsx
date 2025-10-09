"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <p className="opacity-70 mt-1">
        三田祭 提供コーヒーとワッフルのオンラインメニュー
      </p>

      {/* 上部ボタン */}
      <div className="mt-2 hidden sm:flex items-center justify-between gap-3">
        <span className="opacity-70 text-sm">診断から選ぶこともできます</span>
        <Button asChild variant="outline" size="sm">
          <Link href="/quiz">診断してみる</Link>
        </Button>
      </div>

     {/* ☕ コーヒー豆カード一覧 */}
<section
  className="mt-6 grid grid-cols-2 gap-4"
>
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
        className={
          isHL
            ? "ring-2 ring-foreground shadow-lg animate-[pulse_1.6s_ease-in-out_2]"
            : ""
        }
      />
    );
  })}
</section>


      {/* 🧇 ワッフル表示 */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Waffle</h2>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-full h-48 sm:h-56">
              <Image
                src={WAFFLE.photo}
                alt={WAFFLE.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-4 space-y-2">
              <div className="text-lg font-medium">{WAFFLE.name}</div>
              <div className="flex flex-wrap gap-2">
                {WAFFLE.flavor.map((f) => (
                  <span
                    key={f}
                    className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <BeanDialog open={open} onOpenChange={setOpen} bean={active} />

      {/* スマホ用診断ボタン */}
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

