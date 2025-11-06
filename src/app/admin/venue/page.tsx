// app/admin/venue/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Plus, RefreshCw, MapPin, Trash2, Save, Loader2 } from "lucide-react";

// ===============================
// 設定
// ===============================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// テーブル想定スキーマ（必要に応じて調整）
/*
create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  map_url text,
  status text check (status in ('open','busy','closed')) default 'closed',
  open boolean generated always as (status <> 'closed') stored,
  capacity int,
  queue int,
  notes text,
  updated_at timestamptz default now()
);
-- RLS例（閲覧/更新をロールに合わせて調整）
-- alter table public.venues enable row level security;
-- create policy "read venues" on public.venues for select using (true);
-- create policy "update venues" on public.venues for all using (auth.role() = 'authenticated');
*/

type Venue = {
  id: string;
  name: string;
  location: string | null;
  map_url: string | null;
  status: "open" | "busy" | "closed";
  open?: boolean; // stored generated
  capacity: number | null;
  queue: number | null;
  notes: string | null;
  updated_at: string | null;
};

type NewVenue = {
  name: string;
  location: string;
  map_url: string;
  status: "open" | "busy" | "closed";
  capacity?: number | null;
  queue?: number | null;
  notes?: string;
};

const STATUS_OPTIONS: Array<{ value: Venue["status"]; label: string; chip: string }> = [
  { value: "open", label: "開店中", chip: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  { value: "busy", label: "混雑", chip: "bg-amber-100 text-amber-800 border border-amber-200" },
  { value: "closed", label: "閉店", chip: "bg-stone-100 text-stone-700 border border-stone-200" },
];

// ===============================
// ユーティリティ
// ===============================
function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function isValidUrl(s: string) {
  try {
    const u = new URL(s);
    return !!u.protocol && !!u.host;
  } catch {
    return false;
  }
}

// ===============================
//
// ページ本体
//
// ===============================
export default function AdminVenuePage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return venues;
    return venues.filter((v) =>
      [v.name, v.location ?? "", v.notes ?? ""].some((s) => s.toLowerCase().includes(q)),
    );
  }, [search, venues]);

  // 新規作成フォームの状態
  const [draft, setDraft] = useState<NewVenue>({
    name: "",
    location: "",
    map_url: "",
    status: "closed",
    capacity: null,
    queue: null,
    notes: "",
  });

  // 初回ロード
  useEffect(() => {
    (async () => {
      await reload();
    })();
  }, []);

  async function reload() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setVenues((data as Venue[]) ?? []);
    }
    setLoading(false);
  }

  // 編集ハンドラ（ローカル状態を即時反映→保存ボタンで確定）
  function onLocalChange(id: string, patch: Partial<Venue>) {
    setVenues((vs) => vs.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }

  async function saveVenue(v: Venue) {
    setSavingId(v.id);
    setError(null);
    // バリデーション軽め
    if (!v.name || v.name.trim().length === 0) {
      setError("店舗名は必須です。");
      setSavingId(null);
      return;
    }
    if (v.map_url && v.map_url.trim() && !isValidUrl(v.map_url.trim())) {
      setError("マップURLの形式が不正です。");
      setSavingId(null);
      return;
    }
    const payload = {
      name: v.name.trim(),
      location: v.location?.trim() || null,
      map_url: v.map_url?.trim() || null,
      status: v.status,
      capacity: v.capacity ?? null,
      queue: v.queue ?? null,
      notes: v.notes ?? null,
    };
    const { error } = await supabase.from("venues").update(payload).eq("id", v.id);
    if (error) setError(error.message);
    setSavingId(null);
    // リスト反映用にupdated_atを更新して並び替えたいので再取得
    await reload();
  }

  async function deleteVenue(id: string) {
    if (!confirm("この会場を削除しますか？")) return;
    setDeletingId(id);
    setError(null);
    const { error } = await supabase.from("venues").delete().eq("id", id);
    if (error) setError(error.message);
    setDeletingId(null);
    await reload();
  }

  async function createVenue() {
    setCreating(true);
    setError(null);
    if (!draft.name.trim()) {
      setError("店舗名は必須です。");
      setCreating(false);
      return;
    }
    if (draft.map_url && draft.map_url.trim() && !isValidUrl(draft.map_url.trim())) {
      setError("マップURLの形式が不正です。");
      setCreating(false);
      return;
    }
    const payload = {
      name: draft.name.trim(),
      location: draft.location?.trim() || null,
      map_url: draft.map_url?.trim() || null,
      status: draft.status,
      capacity: draft.capacity ?? null,
      queue: draft.queue ?? null,
      notes: draft.notes?.trim() || null,
    };
    const { error } = await supabase.from("venues").insert(payload);
    if (error) {
      setError(error.message);
    } else {
      setDraft({ name: "", location: "", map_url: "", status: "closed", capacity: null, queue: null, notes: "" });
      await reload();
    }
    setCreating(false);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-10">
      {/* ヘッダー */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">会場管理（Admin / Venue）</h1>
          <p className="text-stone-600 mt-1 text-sm">
            三田祭の各会場の「開店状況・混雑・定員・行列・地図URL・メモ」を管理します。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-stone-800 hover:bg-stone-50"
          >
            ← トップへ
          </Link>
          <button
            onClick={reload}
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-stone-800 hover:bg-stone-50"
          >
            <RefreshCw className="h-4 w-4" />
            再読込
          </button>
        </div>
      </header>

      {/* 検索 & 新規 */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">検索</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="会場名・場所・メモで検索…"
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>
      </section>

      {/* 新規作成カード */}
      <section className="mb-10 rounded-2xl border border-amber-200/50 bg-white/80 backdrop-blur p-4 md:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-amber-700" />
          会場を追加
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm text-stone-700 mb-1">会場名（必須）</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm text-stone-700 mb-1">場所（例：第一校舎 133教室）</label>
            <input
              value={draft.location}
              onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm text-stone-700 mb-1">マップURL（任意）</label>
            <input
              value={draft.map_url}
              onChange={(e) => setDraft((d) => ({ ...d, map_url: e.target.value }))}
              placeholder="https://maps.google.com/…"
              className={classNames(
                "w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
                draft.map_url && !isValidUrl(draft.map_url) ? "border-rose-300 focus:ring-rose-300" : "border-stone-300 focus:ring-amber-400/60",
              )}
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm text-stone-700 mb-1">状態</label>
            <select
              value={draft.status}
              onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as Venue["status"] }))}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-stone-700 mb-1">定員（任意）</label>
            <input
              type="number"
              min={0}
              value={draft.capacity ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, capacity: e.target.value ? Number(e.target.value) : null }))}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            />
          </div>

          <div>
            <label className="block text-sm text-stone-700 mb-1">行列（人）</label>
            <input
              type="number"
              min={0}
              value={draft.queue ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, queue: e.target.value ? Number(e.target.value) : null }))}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm text-stone-700 mb-1">メモ（任意）</label>
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={createVenue}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-800 text-white px-4 py-2 text-sm hover:bg-amber-700 disabled:opacity-60"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            追加
          </button>
          <p className="text-xs text-stone-500">※ 状態は後から変更できます</p>
        </div>
      </section>

      {/* エラー */}
      {error && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3">
          {error}
        </div>
      )}

      {/* 一覧 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-stone-900">会場一覧</h2>
          <p className="text-sm text-stone-500">{filtered.length} 件</p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-stone-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            読み込み中…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-stone-200 bg-white p-6 text-stone-600">データがありません。</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((v) => {
              const saving = savingId === v.id;
              const deleting = deletingId === v.id;

              return (
                <li
                  key={v.id}
                  className="relative overflow-hidden rounded-2xl border border-amber-200/50 bg-white/80 backdrop-blur p-5 shadow-sm"
                >
                  <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl opacity-20 bg-gradient-to-tr from-amber-300 to-stone-300" />

                  {/* ヘッダ */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <input
                        value={v.name}
                        onChange={(e) => onLocalChange(v.id, { name: e.target.value })}
                        className="w-full bg-transparent text-xl font-semibold text-stone-900 focus:outline-none border-b border-transparent focus:border-amber-300"
                      />
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={classNames(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            STATUS_OPTIONS.find((s) => s.value === v.status)?.chip,
                          )}
                        >
                          {STATUS_OPTIONS.find((s) => s.value === v.status)?.label}
                        </span>
                        <span className="text-xs text-stone-500">
                          更新: {v.updated_at ? new Date(v.updated_at).toLocaleString() : "-"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveVenue(v)}
                        disabled={saving}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 text-white px-3 py-2 text-xs hover:bg-emerald-600 disabled:opacity-60"
                        title="保存"
                      >
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        保存
                      </button>
                      <button
                        onClick={() => deleteVenue(v.id)}
                        disabled={deleting}
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-700 text-white px-3 py-2 text-xs hover:bg-rose-600 disabled:opacity-60"
                        title="削除"
                      >
                        {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        削除
                      </button>
                    </div>
                  </div>

                  {/* 本文 */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">場所</label>
                      <input
                        value={v.location ?? ""}
                        onChange={(e) => onLocalChange(v.id, { location: e.target.value })}
                        placeholder="例：第一校舎 133教室"
                        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-stone-600 mb-1">状態</label>
                      <select
                        value={v.status}
                        onChange={(e) => onLocalChange(v.id, { status: e.target.value as Venue["status"] })}
                        className="w-full rounded-lg border border-stone-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-stone-600 mb-1">定員</label>
                      <input
                        type="number"
                        min={0}
                        value={v.capacity ?? ""}
                        onChange={(e) =>
                          onLocalChange(v.id, { capacity: e.target.value ? Number(e.target.value) : null })
                        }
                        className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-stone-600 mb-1">行列（人）</label>
                      <input
                        type="number"
                        min={0}
                        value={v.queue ?? ""}
                        onChange={(e) => onLocalChange(v.id, { queue: e.target.value ? Number(e.target.value) : null })}
                        className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-stone-600 mb-1">マップURL</label>
                      <div className="flex items-center gap-2">
                        <input
                          value={v.map_url ?? ""}
                          onChange={(e) => onLocalChange(v.id, { map_url: e.target.value })}
                          placeholder="https://maps.google.com/…"
                          className={classNames(
                            "flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2",
                            v.map_url && !isValidUrl(v.map_url) ? "border-rose-300 focus:ring-rose-300" : "border-stone-300 focus:ring-amber-400/60",
                          )}
                        />
                        {v.map_url ? (
                          <Link
                            href={v.map_url}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 hover:bg-stone-50"
                          >
                            <MapPin className="h-3.5 w-3.5" />
                            開く
                          </Link>
                        ) : (
                          <span className="text-xs text-stone-400">URLなし</span>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-stone-600 mb-1">メモ</label>
                      <textarea
                        value={v.notes ?? ""}
                        onChange={(e) => onLocalChange(v.id, { notes: e.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                        placeholder="例：豆が残り少ない／午後は人手が増える など"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer className="mt-10 text-center text-xs text-stone-500">
        Admin / Venue — KCC Mita 2025
      </footer>
    </main>
  );
}
