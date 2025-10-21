// src/components/ui/VenueStatusBadge.tsx
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import { venueStore } from '@/lib/venueStore';
import { VenueConfig, VenueData, VenueStatus } from '@/lib/venueTheme';

function useVenue() {
  const [data, setData] = useState<VenueData>(() => venueStore.loadData());
  const [cfg,  setCfg]  = useState<VenueConfig>(() => venueStore.loadConfig());

  useEffect(() => {
    // 初回マウント時に最新値を同期
    setData(venueStore.loadData());
    setCfg(venueStore.loadConfig());
    const onStorage = () => {
      setData(venueStore.loadData());
      setCfg(venueStore.loadConfig());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { data, cfg, setData, setCfg };
}

export default function VenueStatusBadge() {
  const pathname = usePathname();
  const router = useRouter();
  const isDiagnosing =
    pathname === '/quiz' || (pathname?.startsWith('/quiz/') && !pathname?.includes('/intro'));

  const { data, cfg } = useVenue();

  const pal = useMemo(() => cfg.palette[data.status], [cfg, data.status]);

  // 設定された文言を決定
  const { main, sub } = useMemo(() => {
    if (data.status === 'available') {
      return { main: cfg.copy.available.main, sub: cfg.copy.available.sub };
    }
    if (data.status === 'moderate') {
      const txt = cfg.copy.moderate.subPrefix.replace('{wait}', data.waitTime || '');
      return { main: cfg.copy.moderate.main, sub: txt };
    }
    return { main: cfg.copy.crowded.main, sub: cfg.copy.crowded.sub };
  }, [cfg, data.status, data.waitTime]);

  // 診断ページでは非表示
  if (isDiagnosing) return null;

  // 下中央に固定（モバイル親指にも程よい）
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 px-3 w-full max-w-[720px] pointer-events-none">
      <div
        role="button"
        aria-label="開催情報を見る"
        onClick={() => router.push('/access')}
        className="pointer-events-auto cursor-pointer"
        style={
          {
            // カラーは CSS 変数で注入
            // @ts-ignore
            '--bgFrom': pal.bgFrom,
            '--bgTo': pal.bgTo,
            '--text': pal.text,
            '--border': pal.border,
            '--dot': pal.dot,
            '--pulse': pal.pulse ?? pal.dot,
          } as React.CSSProperties
        }
      >
        <div
          className={`
            mx-auto rounded-2xl border backdrop-blur-md shadow-lg
            transition-all hover:shadow-xl
          `}
          style={{
            background:
              'linear-gradient(135deg, var(--bgFrom) 0%, var(--bgTo) 100%)',
            borderColor: 'var(--border)',
          }}
        >
          {/* パルスは薄めに */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-2xl opacity-0 animate-[pulse_2.4s_ease-in-out_infinite]"
              style={{ backgroundColor: 'var(--pulse)', opacity: 0.08 }}
            />
            <div className="relative px-4 sm:px-5 py-3 sm:py-3.5">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* 左：ステータス丸＋テキスト */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span
                    aria-hidden
                    className="inline-block h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: 'var(--dot)' }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span
                      className="text-[13px] sm:text-sm font-semibold leading-tight truncate"
                      style={{ color: 'var(--text)' }}
                    >
                      {main}
                    </span>
                    <span className="text-[11px] sm:text-xs text-black/60 mt-0.5 truncate">
                      {sub}
                    </span>
                  </div>
                </div>

                {/* 仕切り */}
                <div className="hidden sm:block h-6 w-px bg-black/10" />

                {/* 中央：場所・時間（2カラム） */}
                <div className="hidden sm:flex items-center gap-4 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MapPin className="h-[14px] w-[14px] text-black/50" />
                    <span className="text-xs text-black/70 truncate max-w-[150px]">
                      {data.shortLocation}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-[14px] w-[14px] text-black/50" />
                    <span className="text-xs text-black/70">{data.hours}</span>
                  </div>
                </div>

                {/* 右：CTAアイコン */}
                <div className="ml-auto flex items-center gap-1">
                  <Users className="h-4 w-4 text-black/40" />
                  <ChevronRight className="h-4 w-4 text-black/40" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ちょい説明（モバイル時のみ） */}
        <div className="sm:hidden mt-1 text-center text-[10px] text-black/45">
          タップで詳細（地図・最新状況）へ
        </div>
      </div>
    </div>
  );
}
