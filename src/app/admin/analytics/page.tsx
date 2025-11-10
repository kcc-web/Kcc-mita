// src/app/admin/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type TypeDistribution = {
  type: string;
  count: number;
  percentage: number;
};

type AgeDistribution = {
  age: string;
  count: number;
};

type AgeStats = {
  age: string;
  total: number;
  handDripYes: number;
  handDripNo: number;
  handDripRate: number; // %
  specialtyKnow: number;
  specialtyHeard: number;
  specialtyUnknown: number;
  specialtyKnowRate: number; // %
};

type Analytics = {
  totalCount: number;
  typeDistribution: TypeDistribution[];
  ageDistribution: AgeDistribution[];
  handDripRate: { yes: number; no: number };
  specialtyKnowledge: { know: number; heard: number; unknown: number };
  ageStats: AgeStats[];
  topType: string | null;
};

const COLORS = ["#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from("quiz_results")
        // 使うカラムだけ取得して転送量を削減
        .select("result_type, age_group, seen_hand_drip, known_specialty, created_at");

      if (error) throw error;
      if (!data) {
        setAnalytics(null);
        return;
      }

      const rows = data as {
        result_type: string;
        age_group: string | null;
        seen_hand_drip: boolean | null;
        known_specialty: "know" | "heard" | "unknown" | null;
        created_at: string;
      }[];

      const totalCount = rows.length;
      if (totalCount === 0) {
        setAnalytics(null);
        return;
      }

      // --- タイプ別分布 ---
      const typeCounts: Record<string, number> = {};
      rows.forEach((row) => {
        const type = row.result_type || "未分類";
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });

      const typeDistribution: TypeDistribution[] = Object.entries(typeCounts).map(
        ([type, count]) => ({
          type,
          count,
          percentage: Math.round((count / totalCount) * 100),
        })
      );

      const topType =
        [...typeDistribution].sort((a, b) => b.count - a.count)[0]?.type ?? null;

      // --- 年代別分布（単純カウント）---
      const ageCounts: Record<string, number> = {};
      rows.forEach((row) => {
        const age = row.age_group || "未回答";
        ageCounts[age] = (ageCounts[age] || 0) + 1;
      });

      const ageDistribution: AgeDistribution[] = Object.entries(ageCounts).map(
        ([age, count]) => ({ age, count })
      );

      // --- 全体のハンドドリップ経験 ---
      const handDripYes = rows.filter((r) => r.seen_hand_drip).length;
      const handDripNo = rows.filter((r) => !r.seen_hand_drip).length;

      const handDripRate = {
        yes: handDripYes,
        no: handDripNo,
      };

      // --- 全体のスペシャルティ認知 ---
      const specialtyKnow = rows.filter((r) => r.known_specialty === "know").length;
      const specialtyHeard = rows.filter((r) => r.known_specialty === "heard").length;
      const specialtyUnknown = rows.filter((r) => r.known_specialty === "unknown").length;

      const specialtyKnowledge = {
        know: specialtyKnow,
        heard: specialtyHeard,
        unknown: specialtyUnknown,
      };

      // --- 年代別 詳細集計 ---
      const ageBuckets: Record<
        string,
        {
          total: number;
          handDripYes: number;
          handDripNo: number;
          specialtyKnow: number;
          specialtyHeard: number;
          specialtyUnknown: number;
        }
      > = {};

      rows.forEach((row) => {
        const age = row.age_group || "未回答";

        if (!ageBuckets[age]) {
          ageBuckets[age] = {
            total: 0,
            handDripYes: 0,
            handDripNo: 0,
            specialtyKnow: 0,
            specialtyHeard: 0,
            specialtyUnknown: 0,
          };
        }

        const bucket = ageBuckets[age];
        bucket.total += 1;

        if (row.seen_hand_drip) {
          bucket.handDripYes += 1;
        } else {
          bucket.handDripNo += 1;
        }

        if (row.known_specialty === "know") bucket.specialtyKnow += 1;
        else if (row.known_specialty === "heard") bucket.specialtyHeard += 1;
        else bucket.specialtyUnknown += 1;
      });

      const ageStats: AgeStats[] = Object.entries(ageBuckets).map(([age, b]) => ({
        age,
        total: b.total,
        handDripYes: b.handDripYes,
        handDripNo: b.handDripNo,
        handDripRate: b.total ? Math.round((b.handDripYes / b.total) * 100) : 0,
        specialtyKnow: b.specialtyKnow,
        specialtyHeard: b.specialtyHeard,
        specialtyUnknown: b.specialtyUnknown,
        specialtyKnowRate: b.total ? Math.round((b.specialtyKnow / b.total) * 100) : 0,
      }));

      setAnalytics({
        totalCount,
        typeDistribution,
        ageDistribution,
        handDripRate,
        specialtyKnowledge,
        ageStats,
        topType,
      });
    } catch (err) {
      console.error("集計エラー:", err);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">診断結果を集計中です...</p>
        </div>
      </main>
    );
  }

  if (!analytics) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">診断データがまだありません。</p>
        </div>
      </main>
    );
  }

  const handDripYesRate = Math.round(
    (analytics.handDripRate.yes / analytics.totalCount) * 100
  );
  const specialtyKnowRate = Math.round(
    (analytics.specialtyKnowledge.know / analytics.totalCount) * 100
  );

  // 年代別の「率」だけをまとめたチャート用データ
  const ageRateChartData = analytics.ageStats
    .slice() // コピー
    .sort((a, b) => a.age.localeCompare(b.age))
    .map((a) => ({
      age: a.age,
      handDripRate: a.handDripRate,
      specialtyKnowRate: a.specialtyKnowRate,
    }));

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      {/* ヘッダー */}
      <header className="flex flex-col gap-2 border-b pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">診断結果アナリティクス</h1>
          <p className="mt-1 text-sm text-gray-500">
            MBTIコーヒー診断の結果をもとに、来場者の傾向をざっくり把握するための管理画面です。
          </p>
        </div>
      </header>

      {/* サマリーカード */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">総診断数</p>
            <p className="mt-2 text-3xl font-bold text-pink-600">
              {analytics.totalCount.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              三田祭期間中に診断を完了した人数の合計
            </p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">ハンドドリップ経験あり</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {handDripYesRate}
              <span className="text-base font-normal text-gray-500">%</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">
              「目の前でハンドドリップを見たことがある」人の割合
            </p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">スペシャルティ知ってる</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {specialtyKnowRate}
              <span className="text-base font-normal text-gray-500">%</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">
              「スペシャルティコーヒーを知っている」と回答した割合
            </p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">最多タイプ</p>
            <p className="mt-2 text-2xl font-bold text-purple-600">
              {analytics.topType ?? "-"}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              最も多かった診断タイプ（全体集計）
            </p>
          </div>
        </div>
      </section>

      {/* タイプ別分布 */}
      <section className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">タイプ別分布</h2>
          <p className="mt-1 text-xs text-gray-500">
            どのタイプが多いかをざっくり確認するための棒グラフ。
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.typeDistribution}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="md:col-span-2 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">タイプ構成比</h2>
          <p className="mt-1 text-xs text-gray-500">
            診断結果がどのタイプにどれくらい分散しているか（%）。
          </p>
          <div className="mt-4 space-y-2 text-sm">
            {analytics.typeDistribution
              .slice()
              .sort((a, b) => b.count - a.count)
              .map((t) => (
                <div
                  key={t.type}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                >
                  <span className="font-medium">{t.type}</span>
                  <span className="text-xs text-gray-500">
                    {t.count}件 / {t.percentage}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 年代別 分布＋率 */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* 年代別分布（件数） */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">年代別分布（件数）</h2>
          <p className="mt-1 text-xs text-gray-500">
            どの年代の来場者が多かったかを円グラフで表示。
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.ageDistribution}
                  dataKey="count"
                  nameKey="age"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {analytics.ageDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.age}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 年代別・率の比較 */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">年代別のハンドドリップ・認知率</h2>
          <p className="mt-1 text-xs text-gray-500">
            年代ごとに、「ハンドドリップ経験率」と「スペシャルティ知ってる率」を比較。
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageRateChartData}>
                <XAxis dataKey="age" />
                <YAxis unit="%" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="handDripRate"
                  name="ハンドドリップ経験率"
                  fill="#3b82f6"
                />
                <Bar
                  dataKey="specialtyKnowRate"
                  name="スペシャルティ認知率"
                  fill="#10b981"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 年代別 詳細テーブル */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">年代別 詳細サマリー</h2>
        <p className="mt-1 text-xs text-gray-500">
          各年代ごとの母数と、ハンドドリップ経験・スペシャルティ認知の内訳。
          ざっくり傾向を知るための一覧。
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-xs text-gray-500">
                <th className="px-3 py-2 font-medium">年代</th>
                <th className="px-3 py-2 font-medium">回答数</th>
                <th className="px-3 py-2 font-medium">ハンドDripあり</th>
                <th className="px-3 py-2 font-medium">ハンドDrip率</th>
                <th className="px-3 py-2 font-medium">スペシャルティ知ってる</th>
                <th className="px-3 py-2 font-medium">認知率</th>
              </tr>
            </thead>
            <tbody>
              {analytics.ageStats
                .slice()
                .sort((a, b) => a.age.localeCompare(b.age))
                .map((age) => (
                  <tr key={age.age} className="border-b last:border-b-0">
                    <td className="px-3 py-2">{age.age}</td>
                    <td className="px-3 py-2">{age.total}</td>
                    <td className="px-3 py-2">{age.handDripYes}</td>
                    <td className="px-3 py-2">{age.handDripRate}%</td>
                    <td className="px-3 py-2">{age.specialtyKnow}</td>
                    <td className="px-3 py-2">{age.specialtyKnowRate}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
