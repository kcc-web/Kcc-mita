// src/components/ui/VenueStatusBadge.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { MapPin, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { composeCopy, pickColors } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  available: "空いてる",
  moderate: "やや混雑",
  crowded: "混雑",
};

// ポーリング間隔（ミリ秒）
const POLLING_INTERVAL = 5000; // 5秒

export default function VenueStatusBadge({
  initialVenue,
  initialSettings,
  className = "",
}: {
  initialVenue: any;
  initialSettings: any;
  className?: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [venue, setVenue] = useState(initialVenue);
  const [settings, setSettings] = useState(initialSettings);

  // ポーリングで定期的にデータを取得
  const fetchVenueData = useCallback(async () => {
    try {
      const { data: venueData } = await supabase
        .from("venue")
        .select("*")
        .limit(1)
        .single();

      if (venueData && JSON.stringify(venueData) !== JSON.stringify(venue)) {
        setVenue(venueData);
      }

      const { data: settingsData } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (settingsData) {
        setSettings({
          ...settingsData,
          colors: pickColors(settingsData),
        });
      }
    } catch (error) {
      console.error("Failed to fetch venue data:", error);
    }
  }, [supabase, venue]);

  // 初回同期 + ポーリング設定
  useEffect(() => {
    // 初回実行
    fetchVenueData();

    // 定期ポーリング
    const intervalId = setInterval(fetchVenueData, POLLING_INTERVAL);

    // クリーンアップ
    return () => clearInterval(intervalId);
  }, [fetchVenueData]);

  const copy = composeCopy(venue, settings);
  const pal =
    venue.status === "available"
      ? settings.colors.available
      : venue.status === "moderate"
      ? settings.colors.moderate
      : settings.colors.crowded;

  const statusLabel = STATUS_LABEL[venue.status] || "不明";

  return (
    <div className={`relative ${className}`}>
      {/* スマホ版：画面幅に応じて最適化 */}
      <div
        className="md:hidden flex flex-col gap-0.5 w-full max-w-full rounded-xl border px-2 py-1.5 shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${pal.bgFrom}, ${pal.bgTo})`,
          borderColor: pal.border,
        }}
      >
        {/* 1行目：ステータス + ドット + サブメッセージ */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="inline-block h-2 w-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: pal.dot }}
          />
          <span
            className="text-[10px] font-bold leading-tight truncate"
            style={{ color: pal.text }}
          >
            {statusLabel}
          </span>
          <span
            className="text-[9px] opacity-70 truncate flex-1 min-w-0"
            style={{ color: pal.text }}
          >
            {copy.sub}
          </span>
        </div>

        {/* 2行目：場所 + 営業時間（極小画面では折り返し） */}
        <div 
          className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px]" 
          style={{ color: pal.text }}
        >
          <div className="flex items-center gap-0.5 opacity-80">
            <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
            <span className="truncate max-w-[120px]">{venue.short_location}</span>
          </div>
          <div className="flex items-center gap-0.5 opacity-80">
            <Clock className="h-2.5 w-2.5 flex-shrink-0" />
            <span className="whitespace-nowrap">{venue.hours}</span>
          </div>
        </div>
      </div>

      {/* タブレット・PC版 */}
      <div
        className="hidden md:inline-flex items-center gap-3 min-w-0 rounded-2xl border px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow"
        style={{
          background: `linear-gradient(135deg, ${pal.bgFrom}, ${pal.bgTo})`,
          borderColor: pal.border,
        }}
      >
        <span
          className="inline-block h-3 w-3 rounded-full flex-shrink-0 shadow-sm"
          style={{ backgroundColor: pal.dot }}
        />

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-baseline gap-2">
            <span
              className="text-sm font-bold leading-tight"
              style={{ color: pal.text }}
            >
              {statusLabel}
            </span>
            <span
              className="text-xs font-medium opacity-80"
              style={{ color: pal.text }}
            >
              {copy.main}
            </span>
          </div>
          <span
            className="hidden lg:block text-[11px] opacity-70 truncate mt-0.5"
            style={{ color: pal.text }}
          >
            {copy.sub}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <MapPin className="h-4 w-4 opacity-60" style={{ color: pal.text }} />
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: pal.text }}>
            {venue.short_location}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Clock className="h-4 w-4 opacity-60" style={{ color: pal.text }} />
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: pal.text }}>
            {venue.hours}
          </span>
        </div>
      </div>
    </div>
  );
}