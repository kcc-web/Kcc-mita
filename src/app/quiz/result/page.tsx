// src/app/result/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResultPage() {
  const sp = useSearchParams();
  const type = sp.get("type") ?? "ENFP";
  const bean = sp.get("bean") ?? "Ethiopia Washed";

  // beanごとの説明（必要に応じて増やしてOK）
  const beanDesc: Record<string, string> = {
    ETH_LIGHT: "華やかでフルーティーな香りが特徴。明るく自由なあなたにぴったり。",
    COL_MID: "バランスが良く穏やかな味わい。落ち着いた性格のあなたに。",
    KEN_DARK: "しっかりした酸味とコク。リーダータイプのあなたにおすすめ。",
    GUA_MID: "チョコのような甘みと深み。努力家で誠実なあなたに。",
  };

  const desc = beanDesc[bean] ?? "あなたにぴったりのコーヒーです☕️";

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-6">あなたの結果</h1>

      <div className="mb-4 text-muted-foreground">
        MBTIタイプ：<span className="font-semibold text-foreground">{type}</span>
      </div>

      <div className="p-6 border rounded-2xl bg-card shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">{bean}</h2>
        <p className="text-muted-foreground">{desc}</p>
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/quiz/intro"
          className="rounded-md border px-4 py-2 text-sm hover:bg-secondary transition-colors"
        >
          もう一度診断する
        </Link>
        <Link
          href={`/menu?bean=${encodeURIComponent(bean)}`}
          className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-all"
        >
          メニューを見る
        </Link>
      </div>
    </main>
  );
}
