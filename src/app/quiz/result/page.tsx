// 旧 /quiz/result を /result へ安全にリダイレクト（Next.js 15対応）

import { redirect } from "next/navigation";
import { use } from "react";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined> | null | undefined;

export default function OldResult({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = use(searchParams) ?? {};
  const qs = new URLSearchParams();

  for (const [k, v] of Object.entries(sp)) {
    if (Array.isArray(v)) {
      for (const x of v) if (x != null) qs.append(k, x);
    } else if (v != null) {
      qs.set(k, v);
    }
  }

  redirect(`/result?${qs.toString()}`);
}

