// src/app/result/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ResultPage() {
  const sp = useSearchParams();
  const type = sp.get("type") ?? "ENFP";
  const bean = sp.get("bean") ?? "ETH_LIGHT";

  const beanInfo: Record<string, { name: string; desc: string; image: string }> = {
    ETH_LIGHT: {
      name: "Ethiopia Washed",
      desc: "華やかでフルーティーな香り。自由で創造的なあなたにぴったりの一杯。",
      image: "/beans/ethiopia.jpg",
    },
    COL_MEDIUM: {
      name: "Colombia",
      desc: "バランスが取れた柔らかい味わい。誠実で落ち着いたあなたに。",
      image: "/beans/colombia.jpg",
    },
    KEN_DARK: {
      name: "Kenya",
      desc: "力強いコクと酸味。リーダーシップを発揮するあなたにぴったり。",
      image: "/beans/kenya.jpg",
    },
    GUA_MID: {
      name: "Guatemala",
      desc: "チョコのような甘みと深み。温かく努力家なあなたにおすすめ。",
      image: "/beans/guatemala.jpg",
    },
  };

  const info = beanInfo[bean] ?? beanInfo["ETH_LIGHT"];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-amber-50 via-white to-rose-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full text-center"
      >
        <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-amber-500">
          あなたにぴったりのコーヒー
        </h1>
        <p className="text-muted-foreground mb-6">
          MBTIタイプ：<span className="font-semibold">{type}</span>
        </p>

        <div className="relative w-full h-64 mb-6">
          <Image
            src={info.image}
            alt={info.name}
            fill
            className="object-cover rounded-2xl shadow-md"
            sizes="(max-width:768px) 100vw, 600px"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-2">{info.name}</h2>
        <p className="text-muted-foreground text-base mb-10">{info.desc}</p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/quiz/intro"
            className="rounded-full border px-6 py-3 text-sm hover:bg-secondary transition-all"
          >
            もう一度診断する
          </Link>
          <Link
            href={`/menu?bean=${encodeURIComponent(bean)}`}
            className="rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition-all"
          >
            メニューを見る
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

