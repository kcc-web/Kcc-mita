"use client";

import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as MenuModule from "@/lib/menu";

type Bean = {
  id: string | number;
  name: string;
  origin?: string;
  elevation?: string | number;
  variety?: string[];
  flavor?: string[];
  flavors?: string[];
  photo?: string;
  image?: string;
};

type Initial = {
  type: string | null;
  bean: string | null;
  score: string | null;
};

const NOTE_BY_GROUP: Record<string, string> = {
  EN: "華やかで好奇心旺盛なあなたには、香りが立つフルーティーな一杯を。今日の出来事も、きっと少しドラマチックに。",
  IN: "静かに味わう時間が似合うあなたへ。やさしい甘みとバランスのよい一杯で、心地よい余白をどうぞ。",
  ES: "元気と会話が似合うあなたに。コクとキレのあるテイストで、今日のムードをもうひと押し。",
  IS: "落ち着きと洞察を大切にするあなたに。酸の輪郭が美しい一杯で、透明感ある集中を。",
};

const getGroup = (type?: string | null) => type?.slice(0, 2).toUpperCase() ?? "EN";
const getNoteByType = (type?: string | null) => NOTE_BY_GROUP[getGroup(type)] ?? "あなたに合うコーヒーを見つけましょう。";

const getBeanIdByType = (type?: string | null): string | undefined => {
  const t = (type ?? "").toUpperCase();
  if (t.startsWith("EN")) return "ethiopia-washed";
  if (t.startsWith("IN")) return "colombia";
  if (t.startsWith("ES")) return "guatemala";
  if (t.startsWith("IS")) return "kenya";
  return undefined;
};

const norm = (s?: string | number | null | undefined) => (s ?? "").toString().trim().toLowerCase();

export default function ResultClient({ initial }: { initial: Initial }) {
  const list: Bean[] = useMemo(() => {
    const mod = MenuModule as any;
    const cand = mod.BEANS ?? mod.MENU ?? mod.default ?? [];
    return Array.isArray(cand) ? (cand as Bean[]) : [];
  }, []);

  const recommended = useMemo(() => {
    if (!list.length) return undefined;

    const byId = (id: string) => list.find((b) => norm(b.id) === norm(id));

    // ① URLパラメータ優先
    if (initial.bean) {
      const found = byId(initial.bean);
      if (found) return found;
    }
    // ② タイプ→ID
    if (initial.type) {
      const mappedId = getBeanIdByType(initial.type);
      if (mappedId) {
        const found = byId(mappedId);
        if (found) return found;
        const loose = list.find(
          (b) => norm(b.name).includes(norm(mappedId)) || norm(b.id).includes(norm(mappedId))
        );
        if (loose) return loose;
      }
    }
    // ③ 先頭
    return list[0];
  }, [list, initial.bean, initial.type]);

  const group = getGroup(initial.type);
  const gradientByGroup: Record<string, string> = {
    EN: "from-pink-100/70 to-orange-100/70 dark:from-pink-950/30 dark:to-orange-950/30",
    IN: "from-amber-100/70 to-emerald-100/70 dark:from-amber-950/30 dark:to-emerald-950/30",
    ES: "from-sky-100/70 to-indigo-100/70 dark:from-sky-950/30 dark:to-indigo-950/30",
    IS: "from-slate-100/70 to-zinc-100/70 dark:from-slate-950/30 dark:to-zinc-950/30",
  };
  const gradient = gradientByGroup[group] ?? gradientByGroup.EN;

  const photoSrc = recommended?.photo ?? (recommended as any)?.image ?? "";
  const flavors =
    (recommended?.flavor?.length ? recommended?.flavor : undefined) ??
    ((recommended as any)?.flavors?.length ? (recommended as any)?.flavors : undefined) ??
    [];

  return (
    <main className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          あなたのコーヒータイプ
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          診断結果に基づいて、おすすめの豆とフレーバーをご提案します。
        </p>
      </header>

      {/* 第一推奨 */}
      <section className="grid grid-cols-1 gap-4 md:gap-6 mb-6">
        <article className="rounded-2xl border shadow-sm p-5 md:p-6 bg-card text-card-foreground">
          <CardHeader className="px-0 pt-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              {recommended?.name ?? "おすすめ豆"}
              <span className="text-base md:text-lg text-muted-foreground">/ タイプ</span>
              <Badge variant="secondary" className="rounded-md">
                {initial.type ?? "未指定"}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-0 space-y-4 md:space-y-5">
            {/* グラデ背景＋画像 */}
            <div className={`rounded-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 bg-gradient-to-br ${gradient} p-4`}>
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
                {photoSrc ? (
                  <Image
                    src={photoSrc}
                    alt={recommended?.name ?? "coffee"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
            </div>

            {/* メタ情報 */}
            <div>
              <div className="text-sm md:text-base text-muted-foreground space-x-2">
                {recommended?.origin && <span>Origin: {recommended.origin}</span>}
                {recommended?.elevation && <span>｜Elevation: {recommended.elevation}</span>}
                {Array.isArray(recommended?.variety) && recommended?.variety?.length ? (
                  <span>｜Variety: {recommended?.variety?.join(", ")}</span>
                ) : null}
              </div>
            </div>

            {/* フレーバー */}
            {!!flavors.length && (
              <div className="flex flex-wrap gap-1.5">
                {flavors.slice(0, 4).map((f: string) => (
                  <Badge key={f} variant="outline" className="rounded-full">
                    {f}
                  </Badge>
                ))}
              </div>
            )}

            {/* コメント */}
            <p className="text-sm md:text-base text-muted-foreground leading-6 line-clamp-3">
              {getNoteByType(initial.type)}
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <Button asChild className="h-10 w-full sm:w-auto">
                <Link href="/menu">メニューへ</Link>
              </Button>
              <Button asChild variant="outline" className="h-10 w-full sm:w-auto">
                <Link href="/quiz/intro">もう一度診断</Link>
              </Button>
            </div>
          </CardContent>
        </article>
      </section>
    </main>
  );
}







