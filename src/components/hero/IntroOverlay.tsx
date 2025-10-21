"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// ✅ Lottie JSONをfetchせず「バンドルimport」
import dropAnim from "@/animations/drop-oil.json";
import waveAnim from "@/animations/wave-variant.json";
import coffeeAnim from "@/animations/coffee.json";

type Phase = "start" | "drop" | "wave" | "coffee" | "fade";

// 各フェーズの表示時間（ミリ秒）
const TIMINGS = {
  start: 1200,
  drop: 1800,
  wave: 2000,
  coffee: 4000,
  fade: 1000,
};

export default function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>("start");
  const [show, setShow] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [animations, setAnimations] = useState<{ drop: any; wave: any; coffee: any } | null>(null);

  const dropRef = useRef<LottieRefCurrentProps>(null);
  const waveRef = useRef<LottieRefCurrentProps>(null);
  const coffeeRef = useRef<LottieRefCurrentProps>(null);

  // アニメーションJSONを読み込み（＝バンドルをセットするだけ）
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }

    setAnimations({ drop: dropAnim as any, wave: waveAnim as any, coffee: coffeeAnim as any });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (phase === "drop" && dropRef.current?.animationItem) {
      dropRef.current.animationItem.setSpeed(2);
    }
  }, [phase]);

  useEffect(() => {
    if (!show || !loaded) return;

    let timer: NodeJS.Timeout;

    switch (phase) {
      case "start":
        timer = setTimeout(() => setPhase("drop"), TIMINGS.start);
        break;
      case "drop":
        timer = setTimeout(() => setPhase("wave"), TIMINGS.drop);
        break;
      case "wave":
        waveRef.current?.play();
        timer = setTimeout(() => setPhase("coffee"), TIMINGS.wave);
        break;
      case "coffee":
        timer = setTimeout(() => setPhase("fade"), TIMINGS.coffee);
        break;
      case "fade":
        timer = setTimeout(() => setShow(false), TIMINGS.fade);
        break;
    }

    return () => clearTimeout(timer);
  }, [phase, show, loaded]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") setShow(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!show || !loaded || !animations) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="fixed inset-0 z-[999] flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => setShow(false)}
      >
        {/* 背景 */}
        <div className="absolute inset-0 bg-white">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* スキップヒント */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.5 }}
          className="absolute top-6 right-6 text-right z-10"
        >
          <p className="text-black/40 text-xs tracking-wider">SKIP (ESC)</p>
        </motion.div>

        {/* 中央：アニメーション */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Drop（雫） */}
          <AnimatePresence mode="wait">
            {phase === "drop" && (
              <motion.div
                key="drop-anim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.5, ease: "easeInOut" } }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  style={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Lottie
                    lottieRef={dropRef}
                    animationData={animations.drop}
                    loop={false}
                    autoplay
                    style={{
                      width: "100%",
                      height: "100%",
                      transform: "scale(1.5)",
                    }}
                    rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
                    // 失敗時フォールバック（lottie-react 2.4+）
                    // @ts-ignore
                    onDataFailed={() => setPhase("wave")}
                    onComplete={() => setPhase("wave")}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wave（波紋） */}
          <AnimatePresence mode="wait">
            {phase === "wave" && (
              <motion.div
                key="wave-anim"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{
                  opacity: { duration: 0.6, ease: "easeInOut" },
                  scale: { duration: 0.8, ease: "easeOut" },
                }}
                className="absolute flex items-center justify-center"
              >
                <div style={{ width: "500px", height: "500px" }}>
                  <Lottie
                    lottieRef={waveRef}
                    animationData={animations.wave}
                    loop={false}
                    autoplay
                    style={{ width: "100%", height: "100%" }}
                    rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Coffee + テキスト */}
          <AnimatePresence mode="wait">
            {phase === "coffee" && (
              <motion.div
                key="coffee-anim"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  opacity: { duration: 1, ease: "easeOut" },
                  y: { duration: 1, ease: "easeOut" },
                }}
                className="flex flex-col items-center"
              >
                <Lottie
                  lottieRef={coffeeRef}
                  animationData={animations.coffee}
                  loop={false}
                  autoplay
                  style={{ width: 300, height: 300 }}
                  rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
                />
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.2,
                    duration: 1,
                    ease: "easeOut",
                  }}
                  className="mt-4 text-center"
                >
                  <p className="text-gray-900 text-base md:text-lg font-medium tracking-wide">
                    Keio Coffee Club
                  </p>
                  <p className="text-gray-600 text-sm mt-1">日常を彩る、一杯のコーヒー</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* タグライン */}
        <AnimatePresence mode="wait">
          {phase === "coffee" && (
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{
                delay: 0.4,
                duration: 1,
                ease: "easeOut",
              }}
              className="absolute bottom-16 text-center px-6"
            >
              <p className="text-gray-500 tracking-[0.14em] text-[11px] uppercase">
                Brewing the Ordinary.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 進行状況 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "fade" ? 0 : 0.3 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
        >
          {["start", "drop", "wave", "coffee"].map((p) => (
            <motion.div
              key={p}
              className={`h-1 rounded-full ${p === phase ? "bg-black/60" : "bg-black/15"}`}
              animate={{ width: p === phase ? 40 : 24 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
