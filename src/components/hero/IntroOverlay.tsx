"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import StreetlineBG from "./StreetlineBG";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Lottie JSON（/public/animations に置く）
const DROP = require("/public/animations/drop-oil.json");
const WAVE = require("/public/animations/wave-variant.json");

type Phase = "city" | "drop" | "wave" | "fade";

export default function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>("city");
  const [show, setShow] = useState(true);
  const dropRef = useRef<LottieRefCurrentProps>(null);
  const waveRef = useRef<LottieRefCurrentProps>(null);

  // 0) ユーザーが「動きを減らす」設定ならスキップ
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
    }
  }, []);

  // 1) City（線画）を少し見せてから Drop へ
  useEffect(() => {
    if (!show || phase !== "city") return;
    const t = setTimeout(() => setPhase("drop"), 800); // 0.8s
    return () => clearTimeout(t);
  }, [show, phase]);

  // 2) Drop 終了 → Wave へ
  useEffect(() => {
    if (phase !== "drop") return;
    const anim = dropRef.current?.animationItem;
    if (!anim) return;
    const onComplete = () => setPhase("wave");
    anim.addEventListener("complete", onComplete);
    return () => anim.removeEventListener("complete", onComplete);
  }, [phase]);

  // 3) Wave 終了 → Fade へ
  useEffect(() => {
    if (phase !== "wave") return;
    const anim = waveRef.current?.animationItem;
    if (!anim) return;
    const onComplete = () => setPhase("fade");
    anim.addEventListener("complete", onComplete);
    waveRef.current?.play(); // 念のため
    return () => anim.removeEventListener("complete", onComplete);
  }, [phase]);

  // 4) Fade 終了 → Intro終了
  useEffect(() => {
    if (phase !== "fade") return;
    const t = setTimeout(() => setShow(false), 600); // 0.6s
    return () => clearTimeout(t);
  }, [phase]);

  // 5) ESCでスキップ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShow(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fade" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-[999] bg-[#0C0C0F] flex items-center justify-center"
        aria-label="Intro"
        onClick={() => setShow(false)} // クリックでもスキップ
      >
        {/* 背景：黒地の白線（遠近） */}
        <StreetlineBG stroke="#FFFFFF" glow="rgba(255,255,255,.9)" vpX={520} vpY={150} />

        {/* 中央：Drop → Wave */}
        <div className="relative w-full h-full flex items-center justify-center">
          {phase === "drop" && (
            <Lottie
              lottieRef={dropRef}
              animationData={DROP}
              loop={false}
              autoplay
              style={{ width: 220, height: 220 }}
              rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            />
          )}
          {phase === "wave" && (
            <Lottie
              lottieRef={waveRef}
              animationData={WAVE}
              loop={false}
              autoplay={false}
              style={{ width: 300, height: 300, position: "absolute" }}
              rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            />
          )}
        </div>

        {/* タグライン（下部） */}
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 0.9 }}
          className="absolute bottom-16 text-center px-6"
        >
          <p className="text-white/80 tracking-[0.12em] text-[12px]">Brewing the Ordinary.</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

