import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default function OldResult({ searchParams }: { searchParams: Record<string, any> }) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (Array.isArray(v)) v.forEach((x) => sp.append(k, x));
    else if (v != null) sp.set(k, v as string);
  }
  redirect(`/result?${sp.toString()}`);
}
