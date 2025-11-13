// src/components/hero/IntroOverlay.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import lottie, { type AnimationItem } from "lottie-web";
import { motion, AnimatePresence } from "framer-motion";

// アニメーションJSON
import dropAnim from "@/animations/drop-oil.json";
import waveAnim from "@/animations/wave-variant.json";
import coffeeAnim from "@/animations/coffee.json";

type Phase = "start" | "drop" | "wave" | "coffee" | "linger" | "fade";

const TIMINGS = {
  start: 800,
  // drop と wave は Lottie の complete イベントで遷移
  coffee: 3000,
  linger: 1200,
  fade: 1500,
} as const;

// ===== 環境判定（SafariはSVG、IG/Chrome/Androidはcanvas推奨） =====
const isIGWebView = () =>
  typeof navigator !== "undefined" &&
  /Instagram|FBAN|FBAV/i.test(navigator.userAgent);

const isSafari = () =>
  typeof navigator !== "undefined" &&
  /Safari/i.test(navigator.userAgent) &&
  !/Chrome|CriOS|Chromium/i.test(navigator.userAgent);

const shouldUseCanvas = () =>
  typeof navigator !== "undefined" &&
  (isIGWebView() || /Android|Chrome|CriOS/i.test(navigator.userAgent));

// ===== Lottie 初期化（StrictMode二重実行/自動再生暴走を防ぐ） =====
function useLottieOnce(
  animationData: object | null,
  opts?: { speed?: number; loop?: boolean }
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!animationData || !containerRef.current) return;
    if (initializedRef.current) return; // StrictMode 2回目対策
    initializedRef.current = true;

    const renderer: "svg" | "canvas" = isSafari() ? "svg" : (shouldUseCanvas() ? "canvas" : "svg");

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer,
      loop: opts?.loop ?? false,
      autoplay: false, // まず止める
      animationData,
      rendererSettings: {
        progressiveLoad: true,
        hideOnTransparent: true,
        clearCanvas: true,
        // @ts-ignore 高DPRでの過描画を抑制
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    // 環境差のブレ軽減
    // @ts-ignore
    anim.setSubframe?.(false);

    const onDOM = () => {
      anim.goToAndStop(0, true); // 必ず0フレームから
      if (opts?.speed) anim.setSpeed(opts.speed);
      anim.play();
    };
    anim.addEventListener("DOMLoaded", onDOM);

    const onVisibility = () => {
      if (document.hidden) anim.pause();
      else anim.play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    animRef.current = anim;

    return () => {
      anim.removeEventListener("DOMLoaded", onDOM);
      document.removeEventListener("visibilitychange", onVisibility);
      anim.destroy();
      animRef.current = null;
      initializedRef.current = false; // 次フェーズで再利用可能に戻す
    };
  }, [animationData, opts?.loop, opts?.speed]);

  return { containerRef, animRef };
}

export default function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>("start");
  const [show, setShow] = useState(false);

  // JSON メモ化（フェーズ切替で再初期化しない）
  const dropData = useMemo(() => dropAnim, []);
  const waveData = useMemo(() => waveAnim, []);
  const coffeeData = useMemo(() => coffeeAnim, []);

  // 1セッション1回だけ表示
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const seen = window.sessionStorage.getItem("kcc_intro_seen");
    if (seen === "1") return;

    window.sessionStorage.setItem("kcc_intro_seen", "1");
    setShow(true);
  }, []);

  // ===== 各フェーズの Lottie 初期化 =====
  const {
    containerRef: dropRef,
    animRef: dropAnimRef,
  } = useLottieOnce(phase === "drop" ? dropData : null, {
    loop: false,
    // 2.0だと初速が暴れやすいので少し抑える
    speed: 1.4,
  });

  const {
    containerRef: waveRef,
    animRef: waveAnimRef,
  } = useLottieOnce(phase === "wave" ? waveData : null, {
    loop: false,
    speed: 0.95,
  });

  const { containerRef: coffeeRef } = useLottieOnce(
    phase === "coffee" || phase === "linger" ? coffeeData : null,
    { loop: false, speed: 0.9 }
  );

  // ===== 完了イベントで遷移（drop -> wave, wave -> coffee）=====
  useEffect(() => {
    if (phase !== "drop") return;
    const a = dropAnimRef.current;
    if (!a) return;
    const onComplete = () => setPhase("wave");
    a.addEventListener("complete", onComplete);
    return () => a.removeEventListener("complete", onComplete);
  }, [phase, dropAnimRef]);

  useEffect(() => {
    if (phase !== "wave") return;
    const a = waveAnimRef.current;
    if (!a) return;
    const onComplete = () => setPhase("coffee");
    a.addEventListener("complete", onComplete);
    return () => a.removeEventListener("complete", onComplete);
  }, [phase, waveAnimRef]);

  // ===== タイマー遷移は後半のみ（coffee -> linger -> fade -> close）=====
  useEffect(() => {
    if (!show) return;
    let t: ReturnType<typeof setTimeout> | null = null;
    switch (phase) {
      case "start":
        t = setTimeout(() => setPhase("drop"), TIMINGS.start);
        break;
      case "coffee":
        t = setTimeout(() => setPhase("linger"), TIMINGS.coffee);
        break;
      case "linger":
        t = setTimeout(() => setPhase("fade"), TIMINGS.linger);
        break;
      case "fade":
        t = setTimeout(() => setShow(false), TIMINGS.fade);
        break;
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [phase, show]);

  // 保険（総時間超えで強制終了）
  useEffect(() => {
    if (!show) return;
    const totalTime = TIMINGS.start + TIMINGS.coffee + TIMINGS.linger + TIMINGS.fade + 500;
    const killer = setTimeout(() => setShow(false), totalTime);
    return () => clearTimeout(killer);
  }, [show]);

  // ESC / Space でスキップ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") setShow(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!show) return null;
  const isFade = phase === "fade";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: isFade ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: TIMINGS.fade / 1000, ease: [0.43, 0.13, 0.23, 0.96] }}
        className="fixed inset-0 z-[999] flex items-center justify-center cursor-pointer overflow-hidden"
        style={{
          background:
            phase === "coffee" || phase === "linger"
              ? "linear-gradient(135deg, #faf8f5 0%, #f5f1eb 50%, #faf8f5 100%)"
              : "#ffffff",
        }}
        onClick={() => setShow(false)}
      >
        {/* テクスチャ */}
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

        {/* SKIP ヒント */}
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
          {/* DROP フェーズ（コンテナには transform を掛けない） */}
          {phase === "drop" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div ref={dropRef} style={{ width: "100vw", height: "100vh" }} aria-hidden />
            </motion.div>
          )}

          {/* WAVE フェーズ（scaleは外側のmotionにのみ） */}
          {phase === "wave" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute flex items-center justify-center"
            >
              <div style={{ width: 500, height: 500 }}>
                <div ref={waveRef} style={{ width: "100%", height: "100%" }} aria-hidden />
              </div>
            </motion.div>
          )}

          {/* COFFEE / LINGER フェーズ */}
          {(phase === "coffee" || phase === "linger") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                duration: isFade ? 1.5 : 0.8,
                ease: isFade ? [0.43, 0.13, 0.23, 0.96] : "easeOut",
              }}
              className="flex flex-col items-center justify-center px-6 max-w-2xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.9, ease: "easeOut" }}
              >
                <div ref={coffeeRef} style={{ width: 320, height: 320 }} aria-hidden />
              </motion.div>

              {/* テキスト群 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-6 text-center space-y-4"
              >
                <h1
                  className="text-xl md:text-2xl font-light text-gray-800"
                  style={{ letterSpacing: "0.15em" }}
                >
                  KEIO COFFEE CLUB
                </h1>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center justify-center gap-3"
                >
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-400 to-gray-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent via-gray-400 to-gray-400" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="space-y-2 pt-2"
                >
                  <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 leading-relaxed">
                    日常を彩る、
                  </p>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 leading-relaxed">
                    一杯のコーヒー
                  </p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.7 }}
                  className="text-sm md:text-base text-gray-600 font-light tracking-wide mt-4"
                >
                  A Cup of Coffee, A Moment of Joy
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* 進捗ドット */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {(["start", "drop", "wave", "coffee", "linger"] as Phase[]).map((p) => (
            <motion.div
              key={p}
              className={`h-1 rounded-full transition-all ${
                p === phase ? "bg-black/60" : "bg-black/15"
              }`}
              style={{ width: p === phase ? 40 : 24 }}
              animate={{
                width: p === phase ? 40 : 24,
                backgroundColor:
                  p === phase ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.15)",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

