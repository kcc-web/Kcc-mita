// src/app/quiz/result/ResultClient.tsx
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
  photo?: string;
  radar?: {
    acidity?: number;
    sweetness?: number;
    body?: number;
    aroma?: number;
    aftertaste?: number;
  };
};

type Initial = {
  type: string | null;
  bean: string | null;
  score: string | null;
};

// ---------- 診断コメント（グループ別） ----------
const NOTE_BY_GROUP: Record<string, string> = {
  EN: "華やかで好奇心旺盛なあなたには、香りが立つフルーティーな一杯を。今日の出来事も、きっと少しドラマチックに。",
  IN: "静かに味わう時間が似合うあなたへ。やさしい甘みとバランスのよい一杯で、心地よい余白をどうぞ。",
  ES: "元気と会話が似合うあなたに。コクとキレのあるテイストで、今日のムードをもうひと押し。",
  IS: "落ち着きと洞察を大切にするあなたに。酸の輪郭が美しい一杯で、透明感ある集中を。",
};

// グループ推定（先頭2文字：EN/IN/ES/IS）
const getGroup = (type?: string|null) => 
    type?.slice(0, 2).toUpperCase() ?? "EN";
const getNoteByType = (type?: string | null): string => {
  return NOTE_BY_GROUP[getGroup(type)] ?? "あなたに合うコーヒーを見つけましょう。";
};


// ---------- タイプ→豆ID（4分類ロジック） ----------
const getBeanIdByType = (type?: string | null): string | undefined => {
  const t = (type ?? "").toUpperCase();
  if (t.startsWith("EN")) return "ethiopia-washed";
  if (t.startsWith("IN")) return "colombia";
  if (t.startsWith("ES")) return "guatemala";
  if (t.startsWith("IS")) return "kenya";
  return undefined;
};


const norm = (s?: string | number | null) =>
  (s ?? "").toString().trim().toLowerCase();

export default function ResultClient({ initial }: { initial: Initial }) {
  // lib/menu.ts の BEANS（named/default どちらでも取得）
  const list: Bean[] = useMemo(() => {
    const cand =
      (MenuModule as any).BEANS ??
      (MenuModule as any).default ??
      [];
    return Array.isArray(cand) ? (cand as Bean[]) : [];
  }, []);

  // 推し豆の決定
  const recommended = useMemo(() => {
    if (!list.length) return undefined;

    // ① ?bean= があれば ID で一致
    if (initial.bean) {
      const target = norm(initial.bean);
      const found = list.find((b) => norm(b.id) === target);
      if (found) return found;
    }

    // ② タイプから4分類でフォールバック
    if (initial.type) {
      const mappedId = getBeanIdByType(initial.type);
      if (mappedId) {
        const found = list.find((b) => norm(b.id) === norm(mappedId));
        if (found) return found;
      }
    }

    // ③ それでも無ければ先頭
    return list[0];
  }, [list, initial.bean, initial.type]);

  // グループで見た目アクセント（淡いグラデ色）
  const group = getGroup(initial.type);
  const gradientByGroup: Record<string, string> = {
    EN: "from-pink-100/70 to-orange-100/70 dark:from-pink-950/30 dark:to-orange-950/30",
    IN: "from-amber-100/70 to-emerald-100/70 dark:from-amber-950/30 dark:to-emerald-950/30",
    ES: "from-sky-100/70 to-indigo-100/70 dark:from-sky-950/30 dark:to-indigo-950/30",
    IS: "from-slate-100/70 to-zinc-100/70 dark:from-slate-950/30 dark:to-zinc-950/30",
  };
  const gradient = gradientByGroup[group] ?? gradientByGroup.EN;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          診断結果 <span className="text-xl opacity-70">☕</span>
        </h1>
        <p className="opacity-70">あなたにおすすめのコーヒーはこちら！</p>
      </header>

      <Card className="overflow-hidden border-0 shadow-md">
        {/* 柔らかい背景グラデ */}
        <div className={`bg-gradient-to-br ${gradient} p-0 sm:p-0`}>
          <div className="p-6 sm:p-7">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <span className="text-base sm:text-lg">タイプ</span>
                {initial.type ? (
                  <Badge variant="secondary" className="rounded-md">
                    {initial.type}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="rounded-md">
                    未指定
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-0 space-y-5">
              {recommended ? (
                <>
                  {/* 写真 */}
                  {recommended.photo && (
                    <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                      <Image
                        src={recommended.photo}
                        alt={recommended.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 66vw"
                        priority
                      />
                    </div>
                  )}

                  {/* 名前＋基本情報 */}
                  <div>
                    <div className="text-xl font-semibold">{recommended.name}</div>
                    <div className="text-sm text-muted-foreground mt-1 space-x-2">
                      {recommended.origin && <span>Origin: {recommended.origin}</span>}
                      {recommended.elevation && <span>｜Elevation: {recommended.elevation}</span>}
                      {Array.isArray(recommended.variety) && recommended.variety.length > 0 && (
                        <span>｜Variety: {recommended.variety.join(", ")}</span>
                      )}
                    </div>
                  </div>

                  {/* フレーバー */}
                  {Array.isArray(recommended.flavor) && recommended.flavor.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {recommended.flavor.slice(0, 4).map((f) => (
                        <Badge key={f} variant="outline" className="rounded-full">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* タイプ別コメント */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getNoteByType(initial.type)}
                  </p>
                </>
              ) : (
                <p className="text-sm">
                  おすすめ豆が特定できませんでした。もう一度診断してみてください。
                </p>
              )}

              {/* スコア（任意） */}
              {initial.score && (
                <p className="text-xs text-muted-foreground/80">スコア: {initial.score}</p>
              )}

              {/* ボタン群 */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <Button asChild className="h-10">
                  <Link href="/menu">メニューへ</Link>
                </Button>
                <Button asChild variant="outline" className="h-10">
                  <Link href="/quiz">もう一度診断</Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </main>
  );
}





