// src/components/HandDripAnim.tsx
"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function HandDripAnim() {
  const [ok, setOk] = useState(true);

  // ユーザーが「減らした動き」を設定していたら非表示
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setOk(false);
  }, []);

  if (!ok) return null;

  return (
    <div className="w-72 h-72 md:w-96 md:h-96">
      {/* @ts-ignore: requireでOK（ビルド時にバンドル） */}
      <Lottie
        animationData={require("@/../public/animations/coffee-drip.json")}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
