// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import { Menu as MenuIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import VenueStatusBadge from "@/components/ui/VenueStatusBadge";
import { pickColors } from "@/lib/format";
import NavLinks from "@/components/ui/NavLinks";

// ← SSRを常に最新化（または export const revalidate = 0 でも可）
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "KCC Mita 2025",
  description: "Keio Coffee Club — Mita Festival 2025",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const { data: venue } = await supabase.from("venue").select("*").limit(1).single();
  const { data: settingsRaw } = await supabase.from("settings").select("*").eq("id", 1).single();

  const settingsSafe =
    settingsRaw ?? {
      wait_unit: "分", dash_symbol: "〜",
      copy_available_main: "すぐにご案内できます ☕️",
      copy_available_sub: "お待たせせずにご提供中です",
      copy_moderate_main: "少し賑わってます ☕️",
      copy_moderate_sub_tmpl: "まもなくご案内（{from}{unit}{dash}{to}{unit}）",
      copy_crowded_main: "多くのお客様にご利用中 ☕️",
      copy_crowded_sub: "香りを楽しみながらお待ちください",
      color_available_bg_from: "#F0FFF4", color_available_bg_to: "#E6FFFA",
      color_available_text: "#065F46", color_available_border: "#A7F3D0", color_available_dot: "#10B981",
      color_moderate_bg_from: "#FFFBEB", color_moderate_bg_to: "#FEF3C7",
      color_moderate_text: "#92400E", color_moderate_border: "#FDE68A", color_moderate_dot: "#F59E0B",
      color_crowded_bg_from: "#FEF2F2", color_crowded_bg_to: "#FFF7ED",
      color_crowded_text: "#991B1B", color_crowded_border: "#FECACA", color_crowded_dot: "#EF4444",
    };

  const settings = {
    wait_unit: settingsSafe.wait_unit,
    dash_symbol: settingsSafe.dash_symbol,
    copy_available_main: settingsSafe.copy_available_main,
    copy_available_sub: settingsSafe.copy_available_sub,
    copy_moderate_main: settingsSafe.copy_moderate_main,
    copy_moderate_sub_tmpl: settingsSafe.copy_moderate_sub_tmpl,
    copy_crowded_main: settingsSafe.copy_crowded_main,
    copy_crowded_sub: settingsSafe.copy_crowded_sub,
    colors: pickColors(settingsSafe),
  };

  const stableVenue = JSON.parse(JSON.stringify(venue ?? null));
  const stableSettings = JSON.parse(JSON.stringify(settings));

  return (
    <html lang="ja">
      <body className="bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-md shadow-[0_1px_10px_rgba(0,0,0,0.03)]">
          <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
            {/* 左：ロゴ */}
            <Link href="/" aria-label="KCC Mita" className="text-base md:text-lg font-semibold tracking-tight flex-shrink-0">
              KCC
            </Link>

            {/* 中央：混雑バッジ */}
            <div className="flex-1 min-w-0 flex justify-center">
              <VenueStatusBadge initialVenue={stableVenue} initialSettings={stableSettings} className="max-w-[360px] w-full" />
            </div>

            {/* 右：ナビ（PC = NavLinks / SP = ハンバーガー内で NavLinks） */}
            <div className="flex items-center gap-3">
              <nav className="hidden md:block">
                <NavLinks />
              </nav>

              <details className="md:hidden relative">
                <summary className="list-none inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border cursor-pointer p-0" aria-label="Open menu">
                  <span className="sr-only">Open menu</span>
                  <MenuIcon className="h-5 w-5" aria-hidden />
                </summary>
                <div className="absolute right-0 mt-2 min-w-[240px] rounded-xl border border-border bg-background shadow-md">
                  <div className="px-4 py-3">
                    {/* NavLinks は SP で縦並びになる設計 */}
                    <NavLinks />
                  </div>
                </div>
              </details>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}




