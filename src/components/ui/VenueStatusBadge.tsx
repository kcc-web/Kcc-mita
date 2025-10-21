// src/components/ui/VenueStatusBadge.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, Clock, ChevronRight } from "lucide-react";

type VenueStatus = "available" | "moderate" | "crowded";

type VenueData = {
  status: VenueStatus;
  location: string;
  shortLocation: string;
  hours: string;
  waitTime: string;
};

type StatusConfig = {
  dot: string;        // 丸の色
  bgFrom: string;     // グラデ開始
  bgTo: string;       // グラデ終了
  text: string;       // メイン文字色
  border: string;     // 枠線色
  main: string;       // メイン文言
  sub: string;        // サブ文言（moderate は {wait} 置換）
};

function getConfig(d: VenueData): StatusConfig {
  const base = {
    available: {
      dot: "#10B981",
      bgFrom: "#F0FFF4",
      bgTo: "#E6FFFA",
      text: "#065F46",
      border: "#A7F3D0",
      main: "すぐにご案内できます ☕️",
      sub: "お待たせせずにご提供中です",
    },
    moderate: {
      dot: "#F59E0B",
      bgFrom: "#FFFBEB",
      bgTo: "#FEF3C7",
      text: "#92400E",
      border: "#FDE68A",
      main: "少し賑わってます ☕️",
      sub: "まもなくご案内（{wait}）",
    },
    crowded: {
      dot: "#EF4444",
      bgFrom: "#FEF2F2",
      bgTo: "#FFF7ED",
      text: "#991B1B",
      border: "#FECACA",
      main: "多くのお客様にご利用中 ☕️",
      sub: "香りを楽しみながらお待ちください",
    },
  } as const;

  const cfg = base[d.status];
  return {
    ...cfg,
    sub: d.status === "moderate" ? cfg.sub.replace("{wait}", d.waitTime) : cfg.sub,
  };
}

export default function VenueStatusBadge({
  variant = "inline",         // "inline"（ヘッダー間） or "floating"（右上/下など）
  className = "",
}: {
  variant?: "inline" | "floating";
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // 診断中ページでは非表示
  const isDiagnosing =
    pathname === "/quiz" || (pathname?.startsWith("/quiz/") && !pathname?.includes("/intro"));
  if (isDiagnosing) return null;

  // ひとまずハードコード（将来はAPI/管理画面から注入）
  const [data] = useState<VenueData>({
    status: "moderate",
    location: "慶應義塾大学 三田キャンパス",
    shortLocation: "KCC三田",
    hours: "10:00-18:00",
    waitTime: "5-10分",
  });

  const cfg = useMemo(() => getConfig(data), [data]);

  // 共通の中身（“読める”ピル）
  const Content = (
    <div
      className="
        group inline-flex items-center gap-3 sm:gap-4 min-w-0
        rounded-2xl border px-3.5 py-2 sm:px-4 sm:py-2.5
        shadow-sm hover:shadow-md transition-shadow cursor-pointer
        max-w-full
      "
      style={{
        background: `linear-gradient(135deg, ${cfg.bgFrom}, ${cfg.bgTo})`,
        borderColor: cfg.border,
      }}
      onClick={() => router.push("/access")}
      aria-label="開催情報（混雑・場所・時間）を見る"
    >
      {/* 左：ステータス */}
      <span
        className="inline-block h-3.5 w-3.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: cfg.dot }}
        aria-hidden
      />

      {/* 中央：メイン＋サブ（トランケート） */}
      <div className="flex flex-col min-w-0">
        <span
          className="text-[12px] sm:text-sm font-semibold leading-tight truncate"
          style={{ color: cfg.text }}
          title={cfg.main}
        >
          {cfg.main}
        </span>
        <span className="text-[10px] sm:text-xs text-black/60 truncate" title={cfg.sub}>
          {cfg.sub}
        </span>
      </div>

      {/* 仕切り（md以上） */}
      <div className="hidden md:block h-6 w-px bg-black/10" />

      {/* 右：場所・時間（小さく） */}
      <div className="hidden md:flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="h-[14px] w-[14px] text-black/50" />
          <span className="text-xs text-black/70 truncate max-w-[140px]">{data.shortLocation}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-[14px] w-[14px] text-black/50" />
          <span className="text-xs text-black/70">{data.hours}</span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 text-black/35 ml-auto md:ml-0" aria-hidden />
    </div>
  );

  // 配置だけ変える
  if (variant === "inline") {
    return <div className={`min-w-0 ${className}`}>{Content}</div>;
  }

  // もし“浮かせたい”場合のフォールバック（今回は使わない）
  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-40 ${className}`}>{Content}</div>
  );
}

