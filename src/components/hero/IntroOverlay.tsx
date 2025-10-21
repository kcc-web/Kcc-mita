"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import StreetlineBG from "./StreetlineBG";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type Phase = "city" | "drop" | "wave" | "coffee" | "fade";

export default function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>("city");
  const [show, setShow] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const dropRef = useRef<LottieRefCurrentProps>(null);
  const waveRef = useRef<LottieRefCurrentProps>(null);
  const coffeeRef = useRef<LottieRefCurrentProps>(null);

  // 初回表示チェック（localStorage使用）
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // 動きを減らす設定の確認
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }

    // 2回目以降はスキップ（開発中はコメントアウト推奨）
    const hasSeenIntro = sessionStorage.getItem("kcc-intro-seen");
    if (hasSeenIntro) {
      setShow(false);
      return;
    }

    setLoaded(true);
    sessionStorage.setItem("kcc-intro-seen", "true");
  }, []);

  // 1) City（線画）を少し見せてから Drop へ
  useEffect(() => {
    if (!show || !loaded || phase !== "city") return;
    const t = setTimeout(() => setPhase("drop"), 1000);
    return () => clearTimeout(t);
  }, [show, loaded, phase]);

  // 2) Drop 終了 → Wave へ
  useEffect(() => {
    if (phase !== "drop") return;
    const anim = dropRef.current?.animationItem;
    if (!anim) {
      // アニメーションが読み込めない場合は次へ
      setTimeout(() => setPhase("wave"), 1000);
      return;
    }
    const onComplete = () => setPhase("wave");
    anim.addEventListener("complete", onComplete);
    return () => anim.removeEventListener("complete", onComplete);
  }, [phase]);

  // 3) Wave 終了 → Coffee へ
  useEffect(() => {
    if (phase !== "wave") return;
    const anim = waveRef.current?.animationItem;
    if (!anim) {
      setTimeout(() => setPhase("coffee"), 1000);
      return;
    }
    const onComplete = () => setPhase("coffee");
    anim.addEventListener("complete", onComplete);
    waveRef.current?.play();
    return () => anim.removeEventListener("complete", onComplete);
  }, [phase]);

  // 4) Coffee 終了 → Fade へ
  useEffect(() => {
    if (phase !== "coffee") return;
    const anim = coffeeRef.current?.animationItem;
    if (!anim) {
      setTimeout(() => setPhase("fade"), 2000);
      return;
    }
    const onComplete = () => setPhase("fade");
    anim.addEventListener("complete", onComplete);
    return () => anim.removeEventListener("complete", onComplete);
  }, [phase]);

  // 5) Fade 終了 → Intro終了
  useEffect(() => {
    if (phase !== "fade") return;
    const t = setTimeout(() => setShow(false), 600);
    return () => clearTimeout(t);
  }, [phase]);

  // 6) ESCまたはクリックでスキップ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { 
      if (e.key === "Escape" || e.key === " ") {
        setShow(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!show || !loaded) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fade" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-[999] bg-[#0C0C0F] flex items-center justify-center cursor-pointer"
        aria-label="Intro animation - Click or press ESC to skip"
        onClick={() => setShow(false)}
      >
        {/* スキップヒント */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          className="absolute top-6 right-6 text-white/60 text-xs"
        >
          Click or press ESC to skip
        </motion.div>

        {/* 背景：黒地の白線（遠近） */}
        {phase === "city" && (
          <StreetlineBG stroke="#FFFFFF" glow="rgba(255,255,255,.9)" vpX={520} vpY={150} />
        )}

        {/* 中央：Drop → Wave → Coffee */}
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {phase === "drop" && (
            <Lottie
              lottieRef={dropRef}
              animationData={require("../../../public/animations/drop-oil.json")}
              loop={false}
              autoplay
              style={{ width: 220, height: 220 }}
              rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            />
          )}
          
          {phase === "wave" && (
            <Lottie
              lottieRef={waveRef}
              animationData={require("../../../public/animations/wave-variant.json")}
              loop={false}
              autoplay={false}
              style={{ width: 300, height: 300, position: "absolute" }}
              rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            />
          )}
          
          {phase === "coffee" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <Lottie
                lottieRef={coffeeRef}
                animationData={require("../../../public/animations/coffee.json")}
                loop={false}
                autoplay
                style={{ width: 280, height: 280 }}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              />
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-4 text-center"
              >
                <p className="text-white/90 text-base md:text-lg font-medium">
                  Keio Coffee Club
                </p>
                <p className="text-white/70 text-sm mt-1">
                  日常を彩る、一杯のコーヒー
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* タグライン（下部） - coffeeフェーズでのみ表示 */}
        {phase === "coffee" && (
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 0.9 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute bottom-16 text-center px-6"
          >
            <p className="text-white/80 tracking-[0.12em] text-[12px]">Brewing the Ordinary.</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

