// src/app/admin/venue/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";

type VenueStatus = "available" | "moderate" | "crowded";
type Venue = {
  id?: number;
  status?: VenueStatus;
  wait_from?: number | null;
  wait_to?: number | null;
  short_location?: string | null;
  hours?: string | null;
};
type Settings = {
  id?: number;
  banner_text?: string | null;
  show_banner?: boolean | null;
};

export default function AdminVenuePage() {
  const [saving, setSaving] = useState(false);
  const [venue, setVenue] = useState<Venue>({
    status: "moderate",
    wait_from: 5,
    wait_to: 10,
    short_location: "KCC三田",
    hours: "10:00-18:00"
  });
  const [settings, setSettings] = useState<Settings>({
    banner_text: "ご来店ありがとうございます！",
    show_banner: true
  });
  const [message, setMessage] = useState<string | null>(null);

  // 既存値の取得（任意：必要な場合のみ）
  useEffect(() => {
    let aborted = false;
    const load = async () => {
      try {
        // 公開エンドポイントを用意していないなら、いったん固定初期値でOK。
        // もし既存値を読みたい場合は /api/admin/load を作って service_role で読む or anonでRLS許可
      } catch {
        // no-op
      }
    };
    load();
    return () => {
      aborted = true;
    };
  }, []);

  const canSave = useMemo(() => {
    if (!venue) return false;
    if (venue.wait_from != null && isNaN(Number(venue.wait_from))) return false;
    if (venue.wait_to != null && isNaN(Number(venue.wait_to))) return false;
    return true;
  }, [venue]);

  const onSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venue, settings })
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "保存に失敗しました");
      }
      setMessage("✅ 保存しました");
    } catch (e: any) {
      setMessage(`❌ ${e.message ?? "保存エラー"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">混雑表示・設定（Admin）</h1>

      <section className="rounded-2xl border p-4 space-y-4">
        <h2 className="text-xl font-semibold">Venue</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Status</span>
            <select
              className="rounded-md border px-3 py-2"
              value={venue.status ?? "moderate"}
              onChange={(e) =>
                setVenue((v) => ({ ...v, status: e.target.value as VenueStatus }))
              }
            >
              <option value="available">available（空いてる）</option>
              <option value="moderate">moderate（やや混雑）</option>
              <option value="crowded">crowded（混雑）</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">待ち時間 From（分）</span>
            <input
              type="number"
              className="rounded-md border px-3 py-2"
              value={venue.wait_from ?? ""}
              onChange={(e) =>
                setVenue((v) => ({ ...v, wait_from: e.target.value === "" ? null : Number(e.target.value) }))
              }
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">待ち時間 To（分）</span>
            <input
              type="number"
              className="rounded-md border px-3 py-2"
              value={venue.wait_to ?? ""}
              onChange={(e) =>
                setVenue((v) => ({ ...v, wait_to: e.target.value === "" ? null : Number(e.target.value) }))
              }
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">短い場所名</span>
            <input
              className="rounded-md border px-3 py-2"
              value={venue.short_location ?? ""}
              onChange={(e) =>
                setVenue((v) => ({ ...v, short_location: e.target.value }))
              }
              placeholder="KCC三田 など"
            />
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm text-gray-600">営業時間表示</span>
            <input
              className="rounded-md border px-3 py-2"
              value={venue.hours ?? ""}
              onChange={(e) => setVenue((v) => ({ ...v, hours: e.target.value }))}
              placeholder="10:00-18:00"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border p-4 space-y-4">
        <h2 className="text-xl font-semibold">Settings</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!settings.show_banner}
              onChange={(e) =>
                setSettings((s) => ({ ...s, show_banner: e.target.checked }))
              }
            />
            <span>バナーを表示</span>
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm text-gray-600">バナー文言</span>
            <input
              className="rounded-md border px-3 py-2"
              value={settings.banner_text ?? ""}
              onChange={(e) =>
                setSettings((s) => ({ ...s, banner_text: e.target.value }))
              }
              placeholder="ご来店ありがとうございます！"
            />
          </label>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={!canSave || saving}
          className="rounded-md border px-4 py-2 font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存する"}
        </button>
        {message && <p className="text-sm">{message}</p>}
      </div>
    </main>
  );
}

