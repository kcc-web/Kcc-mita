"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import dropAnim   from "@/animations/drop-oil.json";
import waveAnim   from "@/animations/wave-variant.json";
import coffeeAnim from "@/animations/coffee.json";

type Phase = "start" | "drop" | "wave" | "coffee" | "linger" | "fade";

// ✨ タイミング調整: wave延長、coffee余韻追加、フェードアウト延長
const TIMINGS = { 
  start: 800,   // 初期待機
  drop: 1800,   // ドロップアニメーション
  wave: 2500,   // 波（延長: 2000→3200でゆっくり）
  coffee: 3500, // コーヒー表示時間（延長: 3000→3500）
  linger: 1500, // 余韻（延長: 1200→1500でさらにゆっくり）
  fade: 1800    // フェードアウト（延長: 1000→1800でじっくり消える）
} as const;

export default function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>("start");
  const [show, setShow]   = useState(true);

  const dropRef   = useRef<LottieRefCurrentProps>(null);
  const waveRef   = useRef<LottieRefCurrentProps>(null);
  const coffeeRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setShow(false);
  }, []);

  useEffect(() => {
    if (!show) return;
    let t: ReturnType<typeof setTimeout> | null = null;
    switch (phase) {
      case "start":
        t = setTimeout(() => setPhase("drop"), TIMINGS.start);
        break;
      case "drop":
        dropRef.current?.animationItem?.setSpeed?.(1.8); // 少し遅く（2→1.8）
        t = setTimeout(() => setPhase("wave"), TIMINGS.drop);
        break;
      case "wave":
        waveRef.current?.play?.();
        t = setTimeout(() => setPhase("coffee"), TIMINGS.wave);
        break;
      case "coffee":
        // coffeeアニメーション開始
        t = setTimeout(() => setPhase("linger"), TIMINGS.coffee);
        break;
      case "linger":
        // 余韻: coffeeが表示されたまま少し待つ
        t = setTimeout(() => setPhase("fade"), TIMINGS.linger);
        break;
      case "fade":
        // フェードアウト開始
        t = setTimeout(() => setShow(false), TIMINGS.fade);
        break;
    }
    return () => { if (t) clearTimeout(t); };
  }, [phase, show]);

  useEffect(() => {
    if (!show) return;
    // 全体の最大時間（自動終了）
    const totalTime = Object.values(TIMINGS).reduce((a, b) => a + b, 0);
    const killer = setTimeout(() => setShow(false), totalTime + 500);
    return () => clearTimeout(killer);
  }, [show]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { 
      if (e.key === "Escape" || e.key === " ") setShow(false); 
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fade" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: TIMINGS.fade / 1000,
          ease: [0.43, 0.13, 0.23, 0.96] // カスタムイージング: ゆっくり始まり、ゆっくり終わる
        }}
        className="fixed inset-0 z-[999] flex items-center justify-center cursor-pointer overflow-hidden"
        style={{
          background: phase === "coffee" || phase === "linger"
            ? "linear-gradient(135deg, #faf8f5 0%, #f5f1eb 50%, #faf8f5 100%)"
            : "#ffffff"
        }}
        onClick={() => setShow(false)}
      >
        {/* カフェ風のテクスチャ（coffeeフェーズのみ） */}
        {(phase === "coffee" || phase === "linger") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.04 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        )}

        {/* 通常のノイズ（drop/waveフェーズ用） */}
        {phase !== "coffee" && phase !== "linger" && (
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        )}

        {/* スキップヒント */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 0.4 }}
          className="absolute top-6 right-6 text-right z-10 select-none"
        >
          <p className="text-black/40 text-xs tracking-wider">SKIP (ESC)</p>
        </motion.div>

        {/* 本体 */}
        <div className="relative w-full h-full flex items-center justify-center">
          {phase === "drop" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Lottie
                lottieRef={dropRef}
                animationData={dropAnim as object}
                loop={false}
                autoplay
                style={{ width: "100vw", height: "100vh", transform: "scale(1.5)" }}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              />
            </motion.div>
          )}
          
          {phase === "wave" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute flex items-center justify-center"
            >
              <div style={{ width: 500, height: 500 }}>
                <Lottie
                  lottieRef={waveRef}
                  animationData={waveAnim as object}
                  loop={false}
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                  rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
                />
              </div>
            </motion.div>
          )}
          
          {(phase === "coffee" || phase === "linger") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] } }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center justify-center px-6 max-w-2xl mx-auto"
              style={{ willChange: "transform, opacity" }}
            >
              {/* コーヒーアニメーション */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.9, ease: "easeOut" }}
                style={{ willChange: "transform, opacity" }}
              >
                <Lottie
                  lottieRef={coffeeRef}
                  animationData={coffeeAnim as object}
                  loop={false}
                  autoplay
                  style={{ width: 320, height: 320 }}
                  rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
                />
              </motion.div>

              {/* メインコピー（全面的に） */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="mt-6 text-center space-y-4"
                style={{ willChange: "transform, opacity" }}
              >
                {/* ブランド名 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  style={{ willChange: "opacity" }}
                >
                  <h1 className="text-xl md:text-2xl font-light text-gray-800" style={{ letterSpacing: "0.15em" }}>
                    KEIO COFFEE CLUB
                  </h1>
                </motion.div>

                {/* 装飾ライン */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="flex items-center justify-center gap-3"
                  style={{ willChange: "transform, opacity" }}
                >
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-400 to-gray-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent via-gray-400 to-gray-400" />
                </motion.div>

                {/* キャッチコピー（大きく全面的に） */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="space-y-2 pt-2"
                  style={{ willChange: "transform, opacity" }}
                >
                  <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 leading-relaxed">
                    日常を彩る、
                  </p>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 leading-relaxed">
                    一杯のコーヒー
                  </p>
                </motion.div>

                {/* サブテキスト（カフェ風） */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.7 }}
                  className="text-sm md:text-base text-gray-600 font-light tracking-wide mt-4"
                  style={{ willChange: "opacity" }}
                >
                  A Cup of Coffee, A Moment of Joy
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* 進捗ドット（lingerフェーズを追加） */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {(["start","drop","wave","coffee","linger"] as Phase[]).map((p) => (
            <motion.div
              key={p}
              className={`h-1 rounded-full transition-all ${
                p === phase ? "bg-black/60" : "bg-black/15"
              }`}
              style={{ width: p === phase ? 40 : 24 }}
              animate={{
                width: p === phase ? 40 : 24,
                backgroundColor: p === phase ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.15)",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

