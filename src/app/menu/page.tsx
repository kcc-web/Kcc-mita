// src/app/menu/page.tsx
import { Suspense } from "react";
import MenuClient from "./MenuClient";

// プリレンダー時の落ちを回避（動的レンダリング）
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center opacity-70">読み込み中…</div>}>
      <MenuClient />
    </Suspense>
  );
}







