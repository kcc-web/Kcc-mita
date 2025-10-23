// src/app/admin/venue/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type VenueStatus = "available" | "moderate" | "crowded";

export default function AdminVenuePage() {
  const supabase = createClient();
  const [venue, setVenue] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: v } = await supabase.from("venue").select("*").limit(1).single();
      const { data: s } = await supabase.from("settings").select("*").eq("id", 1).single();
      setVenue(v);
      setSettings(s);
      setLoading(false);
    })();
  }, [supabase]);

  const setVenueField = (key: string, value: any) =>
    setVenue((prev: any) => ({ ...prev, [key]: value }));

  const setSettingsField = (key: string, value: any) =>
    setSettings((prev: any) => ({ ...prev, [key]: value }));

  const saveAll = async () => {
    if (!venue || !settings) return;
    setSaving(true);
    setMsg(null);

    // 送信時は id / updated_at を落とす（更新禁止カラム対策）
    const { id: _vid, updated_at: _vu, ...venuePayload } = venue;
    const {
      id: _sid,
      updated_at: _su,
      ...settingsPayload
    } = settings;

    // 数値系は number にそろえる
    if (venuePayload.wait_from != null) venuePayload.wait_from = Number(venuePayload.wait_from);
    if (venuePayload.wait_to != null) venuePayload.wait_to = Number(venuePayload.wait_to);

    const res = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ venue: venuePayload, settings: settingsPayload }),
    });

    const json = await res.json();
    setSaving(false);

    if (!res.ok || !json.ok) {
      setMsg(`保存に失敗：${json.error ?? res.statusText}`);
      return;
    }
    setVenue(json.venue);
    setSettings(json.settings);
    setMsg("✅ Supabaseに保存しました（トップのバッジへ即反映）");
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">読み込み中…</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">会場バッジ 管理</h1>

      {/* 運営値（venue） */}
      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-medium">運営情報（venue テーブル）</h2>

        <label className="block">
          <span className="text-sm text-muted-foreground">ステータス</span>
          <select
            value={venue.status as VenueStatus}
            onChange={(e) => setVenueField("status", e.target.value as VenueStatus)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          >
            <option value="available">🟢 空いている</option>
            <option value="moderate">🟡 やや混雑</option>
            <option value="crowded">🔴 混雑</option>
          </select>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-muted-foreground">待ち時間 from（分）</span>
            <input
              type="number"
              value={venue.wait_from ?? ""}
              onChange={(e) => setVenueField("wait_from", e.target.value === "" ? null : Number(e.target.value))}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">待ち時間 to（分）</span>
            <input
              type="number"
              value={venue.wait_to ?? ""}
              onChange={(e) => setVenueField("wait_to", e.target.value === "" ? null : Number(e.target.value))}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-muted-foreground">短い場所名（バッジ表示）</span>
          <input
            value={venue.short_location ?? ""}
            onChange={(e) => setVenueField("short_location", e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm text-muted-foreground">営業時間（例: 10:00-18:00）</span>
          <input
            value={venue.hours ?? ""}
            onChange={(e) => setVenueField("hours", e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </label>
      </section>

      {/* 文言（settings） */}
      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-medium">文言設定（settings テーブル）</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="すぐにご案内（available.main）"
            value={settings.copy_available_main ?? ""}
            onChange={(v) => setSettingsField("copy_available_main", v)}
          />
          <TextField
            label="すぐにご案内・サブ（available.sub）"
            value={settings.copy_available_sub ?? ""}
            onChange={(v) => setSettingsField("copy_available_sub", v)}
          />

          <TextField
            label="やや混雑（moderate.main）"
            value={settings.copy_moderate_main ?? ""}
            onChange={(v) => setSettingsField("copy_moderate_main", v)}
          />
          <TextField
            label="やや混雑・サブ テンプレ（moderate.sub_tmpl）"
            hint="例: まもなくご案内（{from}{unit}{dash}{to}{unit}）"
            value={settings.copy_moderate_sub_tmpl ?? ""}
            onChange={(v) => setSettingsField("copy_moderate_sub_tmpl", v)}
          />

          <TextField
            label="混雑（crowded.main）"
            value={settings.copy_crowded_main ?? ""}
            onChange={(v) => setSettingsField("copy_crowded_main", v)}
          />
          <TextField
            label="混雑・サブ（crowded.sub）"
            value={settings.copy_crowded_sub ?? ""}
            onChange={(v) => setSettingsField("copy_crowded_sub", v)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <PaletteGroup
            title="🟢 Available"
            s={settings}
            prefix="color_available_"
            onChange={setSettingsField}
          />
          <PaletteGroup
            title="🟡 Moderate"
            s={settings}
            prefix="color_moderate_"
            onChange={setSettingsField}
          />
          <PaletteGroup
            title="🔴 Crowded"
            s={settings}
            prefix="color_crowded_"
            onChange={setSettingsField}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <TextField
            label="単位（wait_unit）"
            value={settings.wait_unit ?? "分"}
            onChange={(v) => setSettingsField("wait_unit", v)}
          />
          <TextField
            label="区切り記号（dash_symbol）"
            value={settings.dash_symbol ?? "〜"}
            onChange={(v) => setSettingsField("dash_symbol", v)}
          />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          onClick={saveAll}
          disabled={saving}
          className="rounded-md bg-black text-white px-4 py-2 hover:bg-gray-800 disabled:opacity-60"
        >
          {saving ? "保存中…" : "Supabaseに保存"}
        </button>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        保存すると、トップページの混雑バッジへ Realtime で即反映されます。
      </p>
    </div>
  );
}

/* ---------- 小さな入力コンポーネント ---------- */

function TextField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm">{label}</span>
      {hint && <span className="ml-2 text-xs text-muted-foreground">{hint}</span>}
      <input
        className="mt-1 w-full rounded-md border px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function PaletteGroup({
  title,
  s,
  prefix,
  onChange,
}: {
  title: string;
  s: any;
  prefix: string;
  onChange: (key: string, v: string) => void;
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="font-medium mb-3">{title}</div>
      <div className="grid grid-cols-2 gap-3">
        <ColorField
          label="bg_from"
          value={s[`${prefix}bg_from`] ?? ""}
          onChange={(v) => onChange(`${prefix}bg_from`, v)}
        />
        <ColorField
          label="bg_to"
          value={s[`${prefix}bg_to`] ?? ""}
          onChange={(v) => onChange(`${prefix}bg_to`, v)}
        />
        <ColorField
          label="text"
          value={s[`${prefix}text`] ?? ""}
          onChange={(v) => onChange(`${prefix}text`, v)}
        />
        <ColorField
          label="border"
          value={s[`${prefix}border`] ?? ""}
          onChange={(v) => onChange(`${prefix}border`, v)}
        />
        <ColorField
          label="dot"
          value={s[`${prefix}dot`] ?? ""}
          onChange={(v) => onChange(`${prefix}dot`, v)}
        />
      </div>
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
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          className="flex-1 rounded-md border px-2 py-1 text-sm"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#RRGGBB"
        />
      </div>
    </label>
  );
}
