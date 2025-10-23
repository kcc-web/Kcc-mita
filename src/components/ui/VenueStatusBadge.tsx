// src/components/ui/VenueStatusBadge.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Clock, ChevronRight } from "lucide-react";
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
    <div
      className={`inline-flex items-center gap-3 sm:gap-4 min-w-0 rounded-2xl border px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-sm hover:shadow-md transition cursor-pointer max-w-full ${className}`}
      style={{ background: `linear-gradient(135deg, ${pal.bgFrom}, ${pal.bgTo})`, borderColor: pal.border }}
      onClick={() => window.location.assign("/access")}
      aria-label="開催情報（混雑・場所・時間）を見る"
    >
      <span className="inline-block h-3.5 w-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: pal.dot }} />
      <div className="flex flex-col min-w-0">
        <span className="text-[12px] sm:text-sm font-semibold leading-tight truncate" style={{ color: pal.text }}>
          {copy.main}
        </span>
        <span className="text-[10px] sm:text-xs text-black/60 truncate">{copy.sub}</span>
      </div>
      <div className="hidden sm:flex items-center gap-3 ml-auto">
        <MapPin className="h-[14px] w-[14px] text-black/50" />
        <span className="text-xs text-black/70 whitespace-nowrap">{venue.short_location}</span>
        <Clock className="h-[14px] w-[14px] text-black/50" />
        <span className="text-xs text-black/70">{venue.hours}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-black/35 flex-shrink-0" />
    </div>
  );
}




