"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { LottieRefCurrentProps } from "lottie-react";
import StreetlineBG from "./StreetlineBG";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Lottie JSONファイルをインポート
import dropAnimation from "../../../public/animations/drop-oil.json";
import waveAnimation from "../../../public/animations/wave-variant.json";
import coffeeAnimation from "../../../public/animations/coffee.json";

type Phase = "city" | "drop" | "wave" | "coffee" | "fade";

// 各フェーズの表示時間（ミリ秒）
const TIMINGS = {
  city: 1500,      // 街の線画（長めに見せる）
  drop: 3000,      // drop-oil.json（確実に再生）
  wave: 3000,      // wave-variant.json（確実に再生）
  coffee: 4000,    // coffee.json + テキスト
  fade: 800,       // フェードアウト
};

export default function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>("city");
  const [show, setShow] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const dropRef = useRef<LottieRefCurrentProps>(null);
  const waveRef = useRef<LottieRefCurrentProps>(null);
  const coffeeRef = useRef<LottieRefCurrentProps>(null);

  // 初回表示チェック
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // 動きを減らす設定の確認
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }

    // 開発中はコメントアウト、本番ではコメントイン
    // const hasSeenIntro = sessionStorage.getItem("kcc-intro-seen");
    // if (hasSeenIntro) {
    //   setShow(false);
    //   return;
    // }

    setLoaded(true);
    // sessionStorage.setItem("kcc-intro-seen", "true");
  }, []);

  // フェーズ自動遷移（タイムアウトベース）
  useEffect(() => {
    if (!show || !loaded) return;

    let timer: NodeJS.Timeout;

    switch (phase) {
      case "city":
        timer = setTimeout(() => setPhase("drop"), TIMINGS.city);
        break;
      case "drop":
        timer = setTimeout(() => setPhase("wave"), TIMINGS.drop);
        break;
      case "wave":
        // Wave開始時に明示的に再生
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

  // ESCまたはクリックでスキップ
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
        {/* スキップヒント + 現在のフェーズ表示（デバッグ用） */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5 }}
          className="absolute top-6 right-6 text-right"
        >
          <p className="text-white/60 text-xs tracking-wider">SKIP (ESC)</p>
          {/* デバッグ用：完成後は削除してOK */}
          <p className="text-white/40 text-[10px] mt-1 font-mono">{phase.toUpperCase()}</p>
        </motion.div>

        {/* 背景：黒地の白線（cityフェーズで強く表示） */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "city" ? 1 : 0.2 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <StreetlineBG stroke="#FFFFFF" glow="rgba(255,255,255,.9)" vpX={520} vpY={150} />
        </motion.div>

        {/* 中央：Drop → Wave → Coffee */}
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {phase === "drop" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Lottie
                lottieRef={dropRef}
                animationData={dropAnimation}
                loop={false}
                autoplay
                style={{ width: 220, height: 220 }}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              />
            </motion.div>
          )}
          
          {phase === "wave" && (
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ position: "absolute" }}
            >
              <Lottie
                lottieRef={waveRef}
                animationData={waveAnimation}
                loop={false}
                autoplay
                style={{ width: 300, height: 300 }}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              />
            </motion.div>
          )}
          
          {phase === "coffee" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <Lottie
                lottieRef={coffeeRef}
                animationData={coffeeAnimation}
                loop={false}
                autoplay
                style={{ width: 280, height: 280 }}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              />
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-4 text-center"
              >
                <p className="text-white/90 text-base md:text-lg font-medium tracking-wide">
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
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute bottom-16 text-center px-6"
          >
            <p className="text-white/80 tracking-[0.12em] text-[12px] uppercase">
              Brewing the Ordinary.
            </p>
          </motion.div>
        )}

        {/* 進行状況インジケーター */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5 }}
        >
          {["city", "drop", "wave", "coffee"].map((p) => (
            <div
              key={p}
              className={`h-1 w-8 rounded-full transition-all ${
                p === phase ? "bg-white/80" : "bg-white/20"
              }`}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}