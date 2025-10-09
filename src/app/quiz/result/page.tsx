// src/app/quiz/result/page.tsx
import { Suspense } from "react";
import ResultClient from "./ResultClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = Record<string, string | string[] | undefined>;

export default async function ResultPage({
  searchParams,
}: {
  // Next.js 15 では searchParams が Promise になり得る
  searchParams?: Promise<SP>;
}) {
  const sp = (await searchParams) ?? {};

  // ユーティリティ：string | string[] | undefined -> string | null
  const pick = (v: string | string[] | undefined): string | null =>
    typeof v === "string" ? v : Array.isArray(v) ? v[0] ?? null : null;

  const initial = {
    type: pick(sp.type),
    bean: pick(sp.bean),
    score: pick(sp.score),
  };

  return (
    <Suspense fallback={<div className="p-6 text-center opacity-70">診断結果を読み込み中…</div>}>
      <ResultClient initial={initial} />
    </Suspense>
  );
}

