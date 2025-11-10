// app/admin/venue/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { RefreshCw, Save, Loader2 } from "lucide-react";

type Venue = {
  id: string;
  status: "available" | "moderate" | "crowded";
  wait_from: number | null;
  wait_to: number | null;
  short_location: string;
  hours: string;
};

const STATUS_OPTIONS = [
  { value: "available", label: "空いてる", color: "bg-emerald-100 text-emerald-800" },
  { value: "moderate", label: "やや混雑", color: "bg-amber-100 text-amber-800" },
  { value: "crowded", label: "混雑", color: "bg-rose-100 text-rose-800" },
] as const;

export default function VenueAdminPage() {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    fetchVenue();
  }, []);

  async function fetchVenue() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("venue")
        .select("*")
        .limit(1)
        .single();

      if (error) throw error;
      setVenue(data as Venue);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const VENUE_ID = 1; // ← 後で説明するけど、venue が1行だけならここ固定でOK

async function handleSave() {
  if (!venue) return;

  setSaving(true);
  setError(null);
  setSuccess(false);

  try {
    console.log("🔧 Saving venue payload:", venue);

    const { data, error } = await supabase
      .from("venue")
      .update({
        status: venue.status,
        wait_from: venue.wait_from,
        wait_to: venue.wait_to,
        short_location: venue.short_location,
        hours: venue.hours,
      })
      .eq("id", VENUE_ID)       // ← ここを venue.id じゃなく固定IDにしちゃう案
      .select("*");             // ← arrayで返す（.single()やめる）

    if (error) {
      console.error("❌ Update error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      // 条件にマッチした行が0件のとき
      throw new Error("venue のレコードが見つかりませんでした（id が間違っている可能性があります）");
    }

    console.log("✅ Updated row from Supabase:", data[0]);

    setVenue(data[0] as any);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  } catch (err: any) {
    console.error("🔥 Save failed:", err);
    setError(err.message ?? "保存に失敗しました");
  } finally {
    setSaving(false);
  }
}




  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="rounded-lg border border-rose-200 bg-rose-50 text-rose-800 p-4">
          会場データが見つかりません
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* ヘッダー */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            会場運営管理
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            混雑状況と待ち時間をリアルタイムで更新
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
          >
            ← トップへ
          </Link>
          <button
            onClick={fetchVenue}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            再読込
          </button>
        </div>
      </header>

      {/* エラー表示 */}
      {error && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3">
          {error}
        </div>
      )}

      {/* 成功メッセージ */}
      {success && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 px-4 py-3">
          ✓ 保存しました
        </div>
      )}

      {/* メインフォーム */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        {/* 混雑状況 */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            混雑状況
          </label>
          <div className="grid grid-cols-3 gap-3">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setVenue({ ...venue, status: opt.value })}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                  venue.status === opt.value
                    ? "border-pink-500 bg-pink-50 text-pink-900 scale-105"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${opt.color}`}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 待ち時間 */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            待ち時間（分）
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">最短</label>
              <input
                type="number"
                min={0}
                value={venue.wait_from ?? ""}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    wait_from: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400/60"
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">最長</label>
              <input
                type="number"
                min={0}
                value={venue.wait_to ?? ""}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    wait_to: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400/60"
                placeholder="10"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ※ 「やや混雑」の時に表示されます（例: 5〜10分）
          </p>
        </div>

        {/* 場所 */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            場所（短縮表記）
          </label>
          <input
            type="text"
            value={venue.short_location}
            onChange={(e) =>
              setVenue({ ...venue, short_location: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400/60"
            placeholder="例: KCC三田"
          />
          <p className="text-xs text-gray-500 mt-2">
            ※ ヘッダーのバッジに表示されます
          </p>
        </div>

        {/* 営業時間 */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            営業時間
          </label>
          <input
            type="text"
            value={venue.hours}
            onChange={(e) => setVenue({ ...venue, hours: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400/60"
            placeholder="例: 10:00-18:00"
          />
          <p className="text-xs text-gray-500 mt-2">
            ※ ヘッダーのバッジに表示されます
          </p>
        </div>

        {/* 保存ボタン */}
        <div className="pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white px-6 py-3 text-base font-semibold hover:scale-105 transition-transform disabled:opacity-60 disabled:scale-100"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                保存する
              </>
            )}
          </button>
        </div>
      </div>

      {/* プレビュー */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          プレビュー（ヘッダー表示）
        </h2>
        <div className="inline-flex items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 py-2.5 shadow-sm">
          <span className="inline-block h-3 w-3 rounded-full bg-pink-500" />
          <div className="text-left">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-gray-900">
                {STATUS_OPTIONS.find((s) => s.value === venue.status)?.label}
              </span>
              {venue.status === "moderate" && venue.wait_from && venue.wait_to && (
                <span className="text-xs font-medium text-gray-700">
                  まもなくご案内（{venue.wait_from}〜{venue.wait_to}分）
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-700">
            <span>{venue.short_location}</span>
            <span>{venue.hours}</span>
          </div>
        </div>
      </div>

      <footer className="mt-10 text-center text-xs text-gray-500">
        Admin / Venue — KCC Mita 2025
      </footer>
    </main>
  );
}

