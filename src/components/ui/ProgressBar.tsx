"use client";
import { motion } from "framer-motion";

type Props = {
  value: number;      // 現在値
  max: number;        // 最大値
  height?: number;    // px (デフォルト 8)
  roundedClass?: string; // 角丸クラス（例: "rounded-full"）
  showLabel?: boolean;   // 画面外テキストを出すか
  ariaLabel?: string;
};

export default function ProgressBar({
  value,
  max,
  height = 8,
  roundedClass = "rounded-full",
  showLabel = false,
  ariaLabel = "進捗",
}: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div
      className={`w-full bg-muted shadow-inner overflow-hidden ${roundedClass}`}
      style={{ height }}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      {showLabel && <span className="sr-only">{Math.round(pct)}%</span>}
      <motion.div
        className="h-full"
        style={{
          background: `linear-gradient(
            90deg,
            hsl(var(--primary)) 0%,
            oklch(0.72 0.16 30) 60%,
            hsl(var(--foreground)) 100%
          )`,
        }}
        initial={{ width: "0%" }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      />
    </div>
  );
}

