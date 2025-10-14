"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

function ResultInner() {
  const sp = useSearchParams();
  const type = sp.get("type") || "ENFP";
  const bean = sp.get("bean") || "ETH_LIGHT";

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50 flex flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-lg mx-auto"
      >
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-pink-500">
          あなたのタイプは {type} ☕️
        </h1>

        <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
          {bean} にぴったりの一杯をおすすめします。
        </p>

        <div className="mt-8">
          <Image
            src={`/beans/${bean.toLowerCase()}.jpg`}
            alt={bean}
            width={300}
            height={200}
            className="rounded-xl shadow-md mx-auto"
          />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/menu"
            className="rounded-full bg-foreground text-background px-8 py-4 text-base font-medium hover:opacity-90 shadow-md transition-all"
          >
            メニューを見る
          </Link>
          <Link
            href="/quiz/intro"
            className="rounded-full border px-8 py-4 text-base hover:bg-secondary transition-all"
          >
            もう一度診断する
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center opacity-70">Loading result...</div>}>
      <ResultInner />
    </Suspense>
  );
}



