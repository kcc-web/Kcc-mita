// src/components/ui/VenueStatusBadge.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Clock } from "lucide-react";
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
      {/* スマホ版：コンパクトな2行表示（クリック不要） */}
      <div
        className="md:hidden inline-flex flex-col gap-1 min-w-0 rounded-xl border px-2 py-1.5 shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${pal.bgFrom}, ${pal.bgTo})`,
          borderColor: pal.border,
        }}
      >
        {/* 1行目：ステータス + 待ち時間 */}
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: pal.dot }}
          />
          <span
            className="text-[10px] font-bold leading-tight"
            style={{ color: pal.text }}
          >
            {statusLabel}
          </span>
          <span
            className="text-[9px] opacity-70 truncate"
            style={{ color: pal.text }}
          >
            {copy.sub}
          </span>
        </div>

        {/* 2行目：場所 + 時間 */}
        <div className="flex items-center gap-2 text-[9px]" style={{ color: pal.text }}>
          <div className="flex items-center gap-0.5 opacity-80">
            <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
            <span className="truncate">{venue.short_location}</span>
          </div>
          <div className="flex items-center gap-0.5 opacity-80">
            <Clock className="h-2.5 w-2.5 flex-shrink-0" />
            <span className="whitespace-nowrap">{venue.hours}</span>
          </div>
        </div>
      </div>

      {/* タブレット・PC版：既存の横長デザイン */}
      <div
        className="hidden md:inline-flex items-center gap-3 min-w-0 rounded-2xl border px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow"
        style={{
          background: `linear-gradient(135deg, ${pal.bgFrom}, ${pal.bgTo})`,
          borderColor: pal.border,
        }}
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

        {/* 場所 */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <MapPin className="h-4 w-4 opacity-60" style={{ color: pal.text }} />
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: pal.text }}>
            {venue.short_location}
          </span>
        </div>

        {/* 時間 */}
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