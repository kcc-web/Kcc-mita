// src/components/ui/VenueStatusBadge.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { composeCopy, pickColors } from "@/lib/format";

export default function VenueStatusBadge({
  initialVenue,
  initialSettings,
  className = "",
}: {
  initialVenue: any; initialSettings: any; className?: string;
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
    venue.status === "available" ? settings.colors.available :
    venue.status === "moderate"  ? settings.colors.moderate  :
                                   settings.colors.crowded;

  return (
    <div className={`relative ${className}`}>
      {/* コンパクト表示（常時表示） */}
      <button
        className="inline-flex items-center gap-2 min-w-0 rounded-2xl border px-2.5 sm:px-3.5 py-1.5 sm:py-2 shadow-sm hover:shadow-md transition cursor-pointer w-full"
        style={{ background: `linear-gradient(135deg, ${pal.bgFrom}, ${pal.bgTo})`, borderColor: pal.border }}
        onClick={() => setExpanded(!expanded)}
        aria-label="混雑状況の詳細を表示"
        aria-expanded={expanded}
      >
        {/* ステータスドット */}
        <span 
          className="inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full flex-shrink-0" 
          style={{ backgroundColor: pal.dot }} 
        />
        
        {/* メインテキスト */}
        <div className="flex-1 min-w-0">
          <span 
            className="block text-[10px] sm:text-sm font-semibold leading-tight truncate" 
            style={{ color: pal.text }}
          >
            {copy.main}
          </span>
          {/* スマホでは待ち時間を非表示 */}
          <span className="hidden sm:block text-[10px] sm:text-xs text-black/60 truncate">
            {copy.sub}
          </span>
        </div>

        {/* 場所（タブレット以上） */}
        <div className="hidden md:flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-black/50 flex-shrink-0" />
          <span className="text-[11px] text-black/70 whitespace-nowrap">
            {venue.short_location}
          </span>
        </div>

        {/* 時間（タブレット以上） */}
        <div className="hidden md:flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-black/50 flex-shrink-0" />
          <span className="text-[11px] text-black/70 whitespace-nowrap">
            {venue.hours}
          </span>
        </div>

        {/* 展開アイコン（スマホのみ） */}
        <ChevronDown
          className={`h-3.5 w-3.5 text-black/40 flex-shrink-0 transition-transform md:hidden ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 展開時の詳細表示（スマホのみ） */}
      {expanded && (
        <div
          className="md:hidden absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-lg z-50 p-3 space-y-2"
          style={{ 
            background: `linear-gradient(135deg, ${pal.bgFrom}, ${pal.bgTo})`, 
            borderColor: pal.border 
          }}
        >
          {/* 待ち時間 */}
          <div className="text-[11px] text-black/70">{copy.sub}</div>
          
          {/* 場所 */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-black/50 flex-shrink-0" />
            <span className="text-xs text-black/80">{venue.short_location}</span>
          </div>

          {/* 営業時間 */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-black/50 flex-shrink-0" />
            <span className="text-xs text-black/80">{venue.hours}</span>
          </div>
        </div>
      )}
    </div>
  );
}




