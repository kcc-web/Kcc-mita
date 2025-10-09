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

// 正規化関数（英字は小文字化、空白除去など）
const norm = (s?: string | number | null) =>
  (s ?? "").toString().trim().toLowerCase();

// MBTIタイプの前半2文字で自動的に豆を振り分ける
const getBeanIdByType = (type: string): string | undefined => {
  const t = type.toUpperCase();
  if (t.startsWith("EN")) return "ethiopia-washed"; // 明るく直感的：エチオピア
  if (t.startsWith("IN")) return "colombia";        // 内省的・感情型：コロンビア
  if (t.startsWith("ES")) return "guatemala";       // 行動的・感覚型：グアテマラ
  if (t.startsWith("IS")) return "kenya";           // 冷静・分析型：ケニア
  return undefined;
};

export default function ResultClient({ initial }: { initial: Initial }) {
  // lib/menu.ts の BEANS 配列を取得（default / named どちらにも対応）
  const list: Bean[] = useMemo(() => {
    const cand =
      (MenuModule as any).BEANS ??
      (MenuModule as any).default ??
      [];
    return Array.isArray(cand) ? (cand as Bean[]) : [];
  }, []);

  // 診断結果に基づくおすすめ豆を判定
  const recommended = useMemo(() => {
    if (!list.length) return undefined;

    // ① URLの ?bean= があれば最優先
    if (initial.bean) {
      const target = norm(initial.bean);
      const found = list.find((b) => norm(b.id) === target);
      if (found) return found;
    }

    // ② MBTIタイプから自動マッピング
    if (initial.type) {
      const mappedId = getBeanIdByType(initial.type);
      if (mappedId) {
        const found = list.find((b) => norm(b.id) === norm(mappedId));
        if (found) return found;
      }
    }

    // ③ デフォルトで最初の豆
    return list[0];
  }, [list, initial.bean, initial.type]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">診断結果</h1>
        <p className="opacity-70">あなたにおすすめのコーヒーはこちら！</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>タイプ</span>
            {initial.type ? (
              <Badge variant="secondary">{initial.type}</Badge>
            ) : (
              <Badge variant="outline">未指定</Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {recommended ? (
            <>
              {recommended.photo && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={recommended.photo}
                    alt={recommended.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
              )}

              <div className="text-lg font-medium">{recommended.name}</div>
              <div className="text-sm text-muted-foreground">
                {recommended.origin ? `Origin: ${recommended.origin}` : ""}
                {recommended.elevation
                  ? `　|　Elevation: ${recommended.elevation}`
                  : ""}
                {Array.isArray(recommended.variety) && recommended.variety.length
                  ? `　|　Variety: ${recommended.variety.join(", ")}`
                  : ""}
              </div>

              {Array.isArray(recommended.flavor) && recommended.flavor.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recommended.flavor.map((f: string) => (
                    <Badge key={f} variant="outline" className="rounded-full">
                      {f}
                    </Badge>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm">
              おすすめ豆が特定できませんでした。もう一度診断してみてください。
            </p>
          )}

          {initial.score && (
            <p className="text-sm text-muted-foreground">
              スコア: {initial.score}
            </p>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button asChild>
              <Link href="/menu">メニューへ</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/quiz">もう一度診断</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}




