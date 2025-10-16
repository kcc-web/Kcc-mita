export const dynamic = "force-dynamic";

import { use } from "react";
import ResultClient from "./ResultClient";

type SP = Record<string, string | string[] | undefined> | null | undefined;

export default function ResultPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = use(searchParams) ?? {};
  const one = (v: any) => (typeof v === "string" ? v : Array.isArray(v) ? v[0] ?? null : null);

  const initial = {
    type: one(sp["type"]),
    bean: one(sp["bean"]),
    score: one(sp["score"]),   // 例: encodeURIComponent(JSON.stringify({brightness:72,...}))
  };

  return <ResultClient initial={initial} />;
}


