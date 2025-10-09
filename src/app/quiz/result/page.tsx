// src/app/quiz/result/page.tsx
import { Suspense } from "react";
import ResultClient from "./ResultClient";

export const dynamic = "force-dynamic"; // SSG回避
export const revalidate = 0;

export default function ResultPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  // 期待するクエリ（必要に応じて調整）
  const initial = {
    type: (searchParams?.type as string) ?? null,   // 例: ENFP的な結果キー
    bean: (searchParams?.bean as string) ?? null,   // おすすめ豆ID
    score: (searchParams?.score as string) ?? null, // スコア等
  };

  return (
    <Suspense fallback={<div className="p-6 text-center opacity-70">診断結果を読み込み中…</div>}>
      <ResultClient initial={initial} />
    </Suspense>
  );
}

