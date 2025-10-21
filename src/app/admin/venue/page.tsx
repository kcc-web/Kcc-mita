// src/app/admin/venue/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { venueStore } from "@/lib/venueStore";
import { DEFAULT_CONFIG, DEFAULT_VENUE_DATA, Palette, VenueConfig, VenueData, VenueStatus } from "@/lib/venueTheme";

const statuses: VenueStatus[] = ["available", "moderate", "crowded"];
const statusLabel: Record<VenueStatus, string> = {
  available: "🟢 空いている",
  moderate:  "🟡 やや混雑",
  crowded:   "🔴 混雑",
};

export default function AdminVenuePage() {
  const [cfg, setCfg]   = useState<VenueConfig>(DEFAULT_CONFIG);
  const [data, setData] = useState<VenueData>(DEFAULT_VENUE_DATA);

  useEffect(() => {
    setCfg(venueStore.loadConfig());
    setData(venueStore.loadData());
  }, []);

  const handlePalette = (key: VenueStatus, patch: Partial<Palette>) => {
    setCfg(prev => ({
      ...prev,
      palette: {
        ...prev.palette,
        [key]: { ...prev.palette[key], ...patch },
      },
    }));
  };

  const saveAll = () => {
    venueStore.saveConfig(cfg);
    venueStore.saveData(data);
    alert("保存しました（このタブを開いたままでもバッジに反映されます）");
  };

  const resetAll = () => {
    venueStore.resetAll();
    setCfg(venueStore.loadConfig());
    setData(venueStore.loadData());
  };

  const previewPal = useMemo(() => cfg.palette[data.status], [cfg, data.status]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">会場バッジ 管理</h1>

      {/* プレビュー */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-2">プレビュー（現在の設定）</h2>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: previewPal.border, background: `linear-gradient(135deg, ${previewPal.bgFrom}, ${previewPal.bgTo})` }}
        >
          <div className="flex items-center gap-3">
            <span className="inline-block h-3.5 w-3.5 rounded-full" style={{ background: previewPal.dot }} />
            <div>
              <div className="font-semibold" style={{ color: previewPal.text }}>
                {data.status === "available"
                  ? cfg.copy.available.main
                  : data.status === "moderate"
                  ? cfg.copy.moderate.main
                  : cfg.copy.crowded.main}
              </div>
              <div className="text-sm text-black/70">
                {data.status === "available"
                  ? cfg.copy.available.sub
                  : data.status === "moderate"
                  ? cfg.copy.moderate.subPrefix.replace("{wait}", data.waitTime)
                  : cfg.copy.crowded.sub}
              </div>
            </div>
          </div>
          <div className="mt-3 text-sm text-black/70">
            📍 {data.shortLocation}　🕒 {data.hours}
          </div>
        </div>
      </section>

      {/* 現在値（運営情報） */}
      <section className="mb-10">
        <h2 className="text-lg font-medium mb-3">運営情報</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-muted-foreground">現在ステータス</span>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={data.status}
              onChange={(e) => setData(d => ({ ...d, status: e.target.value as VenueStatus }))}
            >
              {statuses.map(s => (
                <option key={s} value={s}>{statusLabel[s]}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-muted-foreground">待ち時間（例: 5-10分）</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={data.waitTime}
              onChange={(e) => setData(d => ({ ...d, waitTime: e.target.value }))}
            />
          </label>

          <label className="block">
            <span className="text-sm text-muted-foreground">短い場所名（バッジ表示用）</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={data.shortLocation}
              onChange={(e) => setData(d => ({ ...d, shortLocation: e.target.value }))}
            />
          </label>

          <label className="block">
            <span className="text-sm text-muted-foreground">正式な場所名</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={data.location}
              onChange={(e) => setData(d => ({ ...d, location: e.target.value }))}
            />
          </label>

          <label className="block">
            <span className="text-sm text-muted-foreground">営業時間（例: 10:00-18:00）</span>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={data.hours}
              onChange={(e) => setData(d => ({ ...d, hours: e.target.value }))}
            />
          </label>
        </div>
      </section>

      {/* 文言編集 */}
      <section className="mb-10">
        <h2 className="text-lg font-medium mb-3">文言設定</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* available */}
          <div className="rounded-xl border p-4">
            <div className="font-medium mb-2">🟢 空いている</div>
            <label className="block mb-2">
              <span className="text-sm">メイン</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={cfg.copy.available.main}
                onChange={(e) =>
                  setCfg(prev => ({ ...prev, copy: { ...prev.copy, available: { ...prev.copy.available, main: e.target.value }}}))
                }
              />
            </label>
            <label className="block">
              <span className="text-sm">サブ</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={cfg.copy.available.sub}
                onChange={(e) =>
                  setCfg(prev => ({ ...prev, copy: { ...prev.copy, available: { ...prev.copy.available, sub: e.target.value }}}))
                }
              />
            </label>
          </div>

          {/* moderate */}
          <div className="rounded-xl border p-4">
            <div className="font-medium mb-2">🟡 やや混雑</div>
            <label className="block mb-2">
              <span className="text-sm">メイン</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={cfg.copy.moderate.main}
                onChange={(e) =>
                  setCfg(prev => ({ ...prev, copy: { ...prev.copy, moderate: { ...prev.copy.moderate, main: e.target.value }}}))
                }
              />
            </label>
            <label className="block">
              <span className="text-sm">サブ（{`{wait}`} を待ち時間に置換）</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={cfg.copy.moderate.subPrefix}
                onChange={(e) =>
                  setCfg(prev => ({ ...prev, copy: { ...prev.copy, moderate: { ...prev.copy.moderate, subPrefix: e.target.value }}}))
                }
              />
            </label>
          </div>

          {/* crowded */}
          <div className="rounded-xl border p-4 md:col-span-2">
            <div className="font-medium mb-2">🔴 混雑</div>
            <label className="block mb-2">
              <span className="text-sm">メイン</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={cfg.copy.crowded.main}
                onChange={(e) =>
                  setCfg(prev => ({ ...prev, copy: { ...prev.copy, crowded: { ...prev.copy.crowded, main: e.target.value }}}))
                }
              />
            </label>
            <label className="block">
              <span className="text-sm">サブ</span>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={cfg.copy.crowded.sub}
                onChange={(e) =>
                  setCfg(prev => ({ ...prev, copy: { ...prev.copy, crowded: { ...prev.copy.crowded, sub: e.target.value }}}))
                }
              />
            </label>
          </div>
        </div>
      </section>

      {/* カラーパレット */}
      <section className="mb-10">
        <h2 className="text-lg font-medium mb-3">カラーパレット</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statuses.map((s) => {
            const pal = cfg.palette[s];
            return (
              <div key={s} className="rounded-xl border p-4">
                <div className="font-medium mb-3">{statusLabel[s]}</div>
                <div className="grid grid-cols-2 gap-3">
                  <ColorField label="bgFrom" value={pal.bgFrom} onChange={(v) => handlePalette(s, { bgFrom: v })} />
                  <ColorField label="bgTo"   value={pal.bgTo}   onChange={(v) => handlePalette(s, { bgTo: v })} />
                  <ColorField label="text"   value={pal.text}   onChange={(v) => handlePalette(s, { text: v })} />
                  <ColorField label="border" value={pal.border} onChange={(v) => handlePalette(s, { border: v })} />
                  <ColorField label="dot"    value={pal.dot}    onChange={(v) => handlePalette(s, { dot: v })} />
                  <ColorField label="pulse"  value={pal.pulse ?? pal.dot} onChange={(v) => handlePalette(s, { pulse: v })} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button onClick={saveAll} className="rounded-md bg-black text-white px-4 py-2">保存</button>
        <button onClick={resetAll} className="rounded-md border px-4 py-2">初期化</button>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        ※ 現状は <code>localStorage</code> 保存です。Supabase へ切り替える場合は <code>venueStore</code> を差し替えるだけでOK。
      </p>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          className="h-9 w-9 rounded-md border"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          className="flex-1 rounded-md border px-2 py-1 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  );
}
