// src/app/quiz/result/ResultClient.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// 必要ならメニュー情報を使っておすすめ豆を参照
import { BEANS } from "@/lib/menu";

type Initial = {
  type: string | null;
  bean: string | null;
  score: string | null;
};

export default function ResultClient({ initial }: { initial: Initial }) {
  // おすすめ豆の特定（bean クエリ or type から推論）
  const recommended = useMemo(() => {
    if (initial.bean) {
      const idUpper = initial.bean.toUpperCase();
      return BEANS.find(
        (b) => b.key?.toUpperCase() === idUpper || String(b.id).toUpperCase() === idUpper
      );
    }
    // type → bean マッピングを入れたい場合はここにロジックを追加
    return undefined;
  }, [initial.bean]);

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
              <div className="text-lg font-medium">{recommended.name}</div>
              <div className="text-sm text-muted-foreground">
                {recommended.origin ? `Origin: ${recommended.origin}` : ""}
                {recommended.variety ? `　|　Variety: ${recommended.variety}` : ""}
                {recommended.process ? `　|　Process: ${recommended.process}` : ""}
              </div>
              <div className="flex flex-wrap gap-2">
                {(recommended.tags ?? []).map((t) => (
                  <Badge key={t} variant="outline" className="rounded-full">{t}</Badge>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm">
              おすすめ豆が特定できませんでした。もう一度診断してみてください。
            </p>
          )}

          {initial.score && (
            <p className="text-sm text-muted-foreground">スコア: {initial.score}</p>
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

