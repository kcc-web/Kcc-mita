"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useAnimate } from "framer-motion";

const INTRO_FLAG_KEY = "kcc-intro-2025-shown";

// 時間は前回と同じテイストで少し余韻を延ばし、クロスフェードでつなぐ
const BLACK_HOLD_MS  = 1000; // 黒い“間”
const LIGHT_IN_MS    = 900;  // 光イン
const COPY_DELAY_MS  = 700;  // 光→コピーの溜め
const COPY_FADE_MS   = 1200; // コピーのフェード
const WHITE_WASH_MS  = 700;  // 白ベール
const EXIT_FADE_MS   = 500;  // 全体フェードアウト

export default function IntroOverlay() {
  const [show, setShow] = useState(false);
  const forceByQuery = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("intro") === "1";
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const seen = sessionStorage.getItem(INTRO_FLAG_KEY) === "1";
    if (!forceByQuery && (reduced || seen)) return;
    setShow(true);
  }, [forceByQuery]);

  if (!show) return null;

  return <IntroPlayer onFinish={() => setShow(false)} />;
}

function IntroPlayer({ onFinish }: { onFinish: () => void }) {
  const [scope, animate] = useAnimate();

  // Skip（緊急脱出）
  const skip = () => {
    sessionStorage.setItem(INTRO_FLAG_KEY, "1");
    onFinish();
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      // 初回表示フラグ
      sessionStorage.setItem(INTRO_FLAG_KEY, "1");

      // 0) 初期状態（黒100%・光0・コピー0・白0）
      await animate([
        [scope.current, { opacity: 1 }, { duration: 0 }], // ルート
        ["[data-noise]", { opacity: 0.06 }, { duration: 0 }],
        ["[data-light]", { opacity: 0, scale: 0.92 }, { duration: 0 }],
        ["[data-streak]", { opacity: 0 }, { duration: 0 }],
        ["[data-vignette]", { opacity: 1 }, { duration: 0 }],
        ["[data-copy]", { opacity: 0, y: 12, filter: "blur(2px)" }, { duration: 0 }],
        ["[data-white]", { opacity: 0 }, { duration: 0 }],
      ]);

      // 1) 黒の“間”
      await animate(scope.current, {}, { duration: BLACK_HOLD_MS / 1000 });

      // 2) 光をクロスフェードで入れる（黒はそのまま / 上に光レイヤ）
      await Promise.all([
        animate("[data-light]", { opacity: 1, scale: 1 }, { duration: LIGHT_IN_MS / 1000, ease: [0.2, 0.8, 0.2, 1] }),
        animate("[data-streak]", { opacity: 0.35 }, { duration: LIGHT_IN_MS / 1000, ease: "easeOut" }),
      ]);

      // 3) 少し溜める
      await animate(scope.current, {}, { duration: COPY_DELAY_MS / 1000 });

      // 4) コピーをゆっくり表示（黒は徐々に下げる：クロスフェード）
      await Promise.all([
        animate("[data-copy]", { opacity: 1, y: 0, filter: "blur(0px)" }, { duration: COPY_FADE_MS / 1000, ease: [0.22, 1, 0.36, 1] }),
        animate("[data-vignette]", { opacity: 0.85 }, { duration: COPY_FADE_MS / 1000 }),
      ]);

      // 5) 白ベール：ページと一緒にフェードインする雰囲気
      await animate("[data-white]", { opacity: 0.9 }, { duration: WHITE_WASH_MS / 1000, ease: "easeOut" });

      // 6) 全体フェードアウト（クロスフェード終端）
      await animate(scope.current, { opacity: 0 }, { duration: EXIT_FADE_MS / 1000, ease: "easeOut" });

      if (!mounted) return;
      onFinish();
    };

    run();
    return () => { mounted = false; };
  }, [animate, onFinish, scope]);

  return (
    <AnimatePresence>
      <motion.div
        ref={scope}
        key="intro"
        className="fixed inset-0 z-[1000] text-white"
        // GPUレイヤを確保してスムーズ化
        style={{ willChange: "opacity, transform", transform: "translateZ(0)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* ベース黒 + ごく薄いノイズ（GPU負荷を抑えるため低不透明度） */}
        <div className="absolute inset-0 bg-black" />
        <div
          data-noise
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            opacity: 0.06,
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='linear' slope='0.45'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />

        {/* 光レイヤ（円形グロウ + 斜めストリーク + ビネット） */}
        <div className="absolute inset-0">
          {/* 円形グロウ：filter は軽め（blur 8〜10px） */}
          <div
            data-light
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "32vmax",
              height: "32vmax",
              background:
                "radial-gradient(closest-side, rgba(255,246,238,0.95), rgba(255,222,214,0.55) 58%, transparent 78%)",
              filter: "blur(10px)",
              willChange: "opacity, transform",
              transform: "translateZ(0)",
            }}
          />
          {/* ストリーク */}
          <div
            data-streak
            className="absolute inset-0"
            style={{
              opacity: 0,
              background:
                "conic-gradient(from -24deg at 62% 42%, rgba(255,240,230,0.0), rgba(255,235,220,0.14) 15%, rgba(255,200,200,0.08) 28%, rgba(0,0,0,0) 45%)",
              maskImage:
                "radial-gradient(60vmax 60vmax at 58% 44%, #000 45%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(60vmax 60vmax at 58% 44%, #000 45%, transparent 70%)",
              filter: "blur(2px)",
              willChange: "opacity",
            }}
          />
          {/* 周辺減光（コピー時は少しだけ薄くする） */}
          <div
            data-vignette
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(transparent 45%, rgba(0,0,0,0.75))",
            }}
          />
        </div>

        {/* コピー（遅れてゆっくり） */}
        <div
          data-copy
          className="absolute inset-0 flex items-center justify-center"
          style={{ willChange: "opacity, transform, filter", transform: "translateZ(0)" }}
        >
          <h1 className="px-6 text-center leading-tight select-none">
            <span className="block text-[26px] md:text-5xl font-extrabold tracking-tight">
              日常を彩る、
              <span className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-rose-300 to-amber-300">
                一杯のコーヒー
                <span className="absolute left-0 right-0 -bottom-2 h-[8px] rounded-full opacity-60 bg-gradient-to-r from-rose-300/60 to-amber-300/60"></span>
              </span>
            </span>
          </h1>
        </div>

        {/* 白ベール（ページと一緒にフェードイン） */}
        <div
          data-white
          className="absolute inset-0 bg-white"
          style={{ opacity: 0, willChange: "opacity" }}
        />

        {/* Skip（右上） */}
        <button
          onClick={skip}
          className="absolute right-4 top-4 inline-flex items-center rounded-full border border-white/30 bg-black/30 px-3 py-1.5 text-xs backdrop-blur hover:bg-black/50"
          aria-label="イントロをスキップ"
        >
          Skip
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
