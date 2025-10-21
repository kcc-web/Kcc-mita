"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import dropAnim   from "@/animations/drop-oil.json";
import waveAnim   from "@/animations/wave-variant.json";
import coffeeAnim from "@/animations/coffee.json";

type Phase = "start" | "drop" | "wave" | "coffee" | "fade";

const TIMINGS = { start: 800, drop: 1800, wave: 2000, coffee: 3000, fade: 600 } as const;

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
        dropRef.current?.animationItem?.setSpeed?.(2);
        t = setTimeout(() => setPhase("wave"), TIMINGS.drop);
        break;
      case "wave":
        waveRef.current?.play?.();
        t = setTimeout(() => setPhase("coffee"), TIMINGS.wave);
        break;
      case "coffee":
        t = setTimeout(() => setPhase("fade"), TIMINGS.coffee);
        break;
      case "fade":
        t = setTimeout(() => setShow(false), TIMINGS.fade);
        break;
    }
    return () => { if (t) clearTimeout(t); };
  }, [phase, show]);

  useEffect(() => {
    if (!show) return;
    const killer = setTimeout(() => setShow(false), 8000);
    return () => clearTimeout(killer);
  }, [show]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === " ") setShow(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[999] flex items-center justify-center cursor-pointer overflow-hidden bg-white"
        onClick={() => setShow(false)}
      >
        {/* うっすらノイズ */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

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
            <div className="absolute inset-0 flex items-center justify-center">
              <Lottie
                lottieRef={dropRef}
                animationData={dropAnim as object}
                loop={false}
                autoplay
                style={{ width: "100vw", height: "100vh", transform: "scale(1.5)" }}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              />
            </div>
          )}
          {phase === "wave" && (
            <div className="absolute flex items-center justify-center">
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
            </div>
          )}
          {phase === "coffee" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <Lottie
                lottieRef={coffeeRef}
                animationData={coffeeAnim as object}
                loop={false}
                autoplay
                style={{ width: 300, height: 300 }}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              />
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-4 text-center"
              >
                <p className="text-gray-900 text-base md:text-lg font-medium tracking-wide">
                  Keio Coffee Club
                </p>
                <p className="text-gray-600 text-sm mt-1">日常を彩る、一杯のコーヒー</p>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* 進捗ドット */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {(["start","drop","wave","coffee"] as Phase[]).map((p) => (
            <div
              key={p}
              className={`h-1 rounded-full ${p === phase ? "bg-black/60" : "bg-black/15"}`}
              style={{ width: p === phase ? 40 : 24 }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

