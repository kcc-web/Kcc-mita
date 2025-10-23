// src/components/ui/VenueStatusBadge.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { composeCopy, pickColors } from "@/lib/format";

// 日本語ステータスラベル
const STATUS_LABEL: Record<string, string> = {
  available: "空いてる",
  moderate: "やや混雑",
  crowded: "混雑",
};

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
  const [expanded, setExpanded] = useState(false);

  // 初回同期（SSRとCSRの差分を吸収）
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("venue").select("*").limit(1).single();
      if (data && JSON.stringify(data) !== JSON.stringify(initialVenue)) setVenue(data);
    })();
  }, [supabase, initialVenue]);

  // Realtime購読（venue / settings）
  useEffect(() => {
    const chVenue = supabase
      .channel("venue_changes")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "venue" }, (p) => setVenue(p.new))
      .subscribe();

    const chSettings = supabase
      .channel("settings_changes")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "settings" }, (p) =>
        setSettings({ ...settings, ...p.new, colors: pickColors(p.new) })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chVenue);
      supabase.removeChannel(chSettings);
    };
  }, [supabase, settings]);

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
      {/* メインバッジ（常時表示） */}
      <button
        className="inline-flex items-center gap-2 sm:gap-3 min-w-0 rounded-2xl border px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer w-full"
        style={{
          background: `linear-gradient(135deg, ${pal.bgFrom}, ${pal.bgTo})`,
          borderColor: pal.border,
        }}
        onClick={() => setExpanded(!expanded)}
        aria-label="混雑状況の詳細を表示"
        aria-expanded={expanded}
      >
        {/* ステータスドット */}
        <span
          className="inline-block h-3 w-3 rounded-full flex-shrink-0 shadow-sm"
          style={{ backgroundColor: pal.dot }}
        />

        {/* ステータステキスト + メインコピー */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-baseline gap-2">
            <span
              className="text-xs sm:text-sm font-bold leading-tight"
              style={{ color: pal.text }}
            >
              {statusLabel}
            </span>
            <span
              className="hidden sm:inline text-xs font-medium opacity-80"
              style={{ color: pal.text }}
            >
              {copy.main}
            </span>
          </div>
          {/* 待ち時間（デスクトップのみ） */}
          <span
            className="hidden lg:block text-[11px] opacity-70 truncate mt-0.5"
            style={{ color: pal.text }}
          >
            {copy.sub}
          </span>
        </div>

        {/* 場所（タブレット以上） */}
        <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
          <MapPin className="h-4 w-4 opacity-60" style={{ color: pal.text }} />
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: pal.text }}>
            {venue.short_location}
          </span>
        </div>

        {/* 時間（タブレット以上） */}
        <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
          <Clock className="h-4 w-4 opacity-60" style={{ color: pal.text }} />
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: pal.text }}>
            {venue.hours}
          </span>
        </div>

        {/* 展開アイコン（スマホのみ） */}
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 transition-transform md:hidden ${
            expanded ? "rotate-180" : ""
          }`}
          style={{ color: pal.text, opacity: 0.5 }}
        />
      </button>

      {/* 展開時の詳細表示（スマホのみ） */}
      {expanded && (
        <div
          className="md:hidden absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-lg z-50 p-4 space-y-3"
          style={{
            background: `linear-gradient(135deg, ${pal.bgFrom}, ${pal.bgTo})`,
            borderColor: pal.border,
          }}
        >
          {/* 待ち時間 */}
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: pal.text, opacity: 0.7 }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: pal.text }}>
                待ち時間
              </p>
              <p className="text-sm" style={{ color: pal.text }}>
                {copy.sub}
              </p>
            </div>
          </div>

          {/* 場所 */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: pal.text, opacity: 0.7 }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: pal.text }}>
                開催場所
              </p>
              <p className="text-sm" style={{ color: pal.text }}>
                {venue.short_location}
              </p>
            </div>
          </div>

          {/* 営業時間 */}
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: pal.text, opacity: 0.7 }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: pal.text }}>
                営業時間
              </p>
              <p className="text-sm" style={{ color: pal.text }}>
                {venue.hours}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




