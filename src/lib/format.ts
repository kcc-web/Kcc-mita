// src/lib/format.ts
export type VenueSnap = {
  status: "available" | "moderate" | "crowded";
  wait_from: number | null;
  wait_to: number | null;
  short_location: string;
  hours: string;
};

export type SettingsSnap = {
  wait_unit: string;
  dash_symbol: string;
  copy_available_main: string;
  copy_available_sub: string;
  copy_moderate_main: string;
  copy_moderate_sub_tmpl: string; // 例: "まもなくご案内（{from}{unit}{dash}{to}{unit}）"
  copy_crowded_main: string;
  copy_crowded_sub: string;
  colors: {
    available: Palette; moderate: Palette; crowded: Palette;
  };
};

type Palette = { bgFrom: string; bgTo: string; text: string; border: string; dot: string };

export function pickColors(s: any) {
  return {
    available: { bgFrom: s.color_available_bg_from, bgTo: s.color_available_bg_to, text: s.color_available_text, border: s.color_available_border, dot: s.color_available_dot },
    moderate:  { bgFrom: s.color_moderate_bg_from,  bgTo: s.color_moderate_bg_to,  text: s.color_moderate_text,  border: s.color_moderate_border,  dot: s.color_moderate_dot  },
    crowded:   { bgFrom: s.color_crowded_bg_from,   bgTo: s.color_crowded_bg_to,   text: s.color_crowded_text,   border: s.color_crowded_border,   dot: s.color_crowded_dot   },
  };
}

// ← すべて置換する（(unit) 残りを防止）
export function buildSubModerate(
  tmpl: string, from: number|null, to: number|null, unit: string, dash: string
) {
  return tmpl
    .replaceAll("{from}", String(from ?? ""))
    .replaceAll("{to}",   String(to   ?? ""))
    .replaceAll("{unit}", unit)
    .replaceAll("{dash}", dash);
}

export function composeCopy(venue: VenueSnap, settings: SettingsSnap) {
  if (venue.status === "available") {
    return { main: settings.copy_available_main, sub: settings.copy_available_sub };
  }
  if (venue.status === "moderate") {
    return {
      main: settings.copy_moderate_main,
      sub: buildSubModerate(
        settings.copy_moderate_sub_tmpl,
        venue.wait_from, venue.wait_to, settings.wait_unit, settings.dash_symbol
      ),
    };
  }
  return { main: settings.copy_crowded_main, sub: settings.copy_crowded_sub };
}

