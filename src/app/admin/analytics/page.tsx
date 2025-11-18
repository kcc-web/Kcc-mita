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
  LineChart,
  Line,
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

type AgeTypeStat = {
  age: string;
  type: string;
  count: number;
  percentage: number; // その年代の中での割合
};

type DailyStats = {
  date: string;
  pageViews: number;
  quizCompletions: number;
};

type PageStats = {
  page: string;
  count: number;
};

type Analytics = {
  totalCount: number;
  typeDistribution: TypeDistribution[];
  ageDistribution: AgeDistribution[];
  handDripRate: { yes: number; no: number };
  specialtyKnowledge: { know: number; heard: number; unknown: number };
  ageStats: AgeStats[];
  ageTypeStats: AgeTypeStat[];
  topType: string | null;
  totalPageViews: number;
  completionRate: number;
  dailyStats: DailyStats[];
  topPages: PageStats[];
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
      // 診断結果を取得
      const { data: quizData, error: quizError } = await supabase
        .from("quiz_results")
        .select("result_type, age_group, seen_hand_drip, known_specialty, created_at");

      if (quizError) throw quizError;

      // ページビューを取得
      const { data: pageViewData, error: pageViewError } = await supabase
        .from("page_views")
        .select("page_path, created_at");

      if (pageViewError) throw pageViewError;

      const rows = (quizData || []) as {
        result_type: string;
        age_group: string | null;
        seen_hand_drip: boolean | null;
        known_specialty: "know" | "heard" | "unknown" | null;
        created_at: string;
      }[];

      const pageViews = (pageViewData || []) as {
        page_path: string;
        created_at: string;
      }[];

      const totalCount = rows.length;
      const totalPageViews = pageViews.length;

      if (totalCount === 0 && totalPageViews === 0) {
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

      // --- 年代別分布 ---
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

      const ageTypeCounts: Record<string, Record<string, number>> = {};

      rows.forEach((row) => {
        const age = row.age_group || "未回答";
        const type = row.result_type || "未分類";

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

        if (!ageTypeCounts[age]) {
          ageTypeCounts[age] = {};
        }
        ageTypeCounts[age][type] = (ageTypeCounts[age][type] || 0) + 1;
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

      const ageTypeStats: AgeTypeStat[] = [];
      Object.entries(ageTypeCounts).forEach(([age, typeMap]) => {
        const total = ageBuckets[age]?.total ?? Object.values(typeMap).reduce((a, c) => a + c, 0);
        Object.entries(typeMap).forEach(([type, count]) => {
          ageTypeStats.push({
            age,
            type,
            count,
            percentage: total ? Math.round((count / total) * 100) : 0,
          });
        });
      });

      // --- 日別統計 ---
      const dailyMap: Record<string, { pageViews: number; quizCompletions: number }> = {};

      pageViews.forEach((pv) => {
        const date = new Date(pv.created_at).toLocaleDateString("ja-JP", {
          month: "short",
          day: "numeric",
        });
        if (!dailyMap[date]) {
          dailyMap[date] = { pageViews: 0, quizCompletions: 0 };
        }
        dailyMap[date].pageViews += 1;
      });

      rows.forEach((row) => {
        const date = new Date(row.created_at).toLocaleDateString("ja-JP", {
          month: "short",
          day: "numeric",
        });
        if (!dailyMap[date]) {
          dailyMap[date] = { pageViews: 0, quizCompletions: 0 };
        }
        dailyMap[date].quizCompletions += 1;
      });

      const dailyStats: DailyStats[] = Object.entries(dailyMap)
        .map(([date, stats]) => ({
          date,
          pageViews: stats.pageViews,
          quizCompletions: stats.quizCompletions,
        }))
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });

      // --- ページ別アクセス数 ---
      const pageCounts: Record<string, number> = {};
      pageViews.forEach((pv) => {
        const page = pv.page_path === "/" ? "トップ" : pv.page_path;
        pageCounts[page] = (pageCounts[page] || 0) + 1;
      });

      const topPages: PageStats[] = Object.entries(pageCounts)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // --- 診断完了率 ---
      const completionRate =
        totalPageViews > 0 ? Math.round((totalCount / totalPageViews) * 100) : 0;

      setAnalytics({
        totalCount,
        typeDistribution,
        ageDistribution,
        handDripRate,
        specialtyKnowledge,
        ageStats,
        ageTypeStats,
        topType,
        totalPageViews,
        completionRate,
        dailyStats,
        topPages,
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

  const ageRateChartData = analytics.ageStats
    .slice()
    .sort((a, b) => a.age.localeCompare(b.age))
    .map((a) => ({
      age: a.age,
      handDripRate: a.handDripRate,
      specialtyKnowRate: a.specialtyKnowRate,
    }));

  const allTypes = analytics.typeDistribution.map((t) => t.type);
  const ageTypeChartData = analytics.ageStats
    .slice()
    .sort((a, b) => a.age.localeCompare(b.age))
    .map((ageRow) => {
      const row: Record<string, number | string> = { age: ageRow.age };
      analytics.ageTypeStats
        .filter((s) => s.age === ageRow.age)
        .forEach((s) => {
          row[s.type] = s.count;
        });
      return row;
    });

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      {/* ヘッダー */}
      <header className="flex flex-col gap-2 border-b pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">診断結果アナリティクス</h1>
          <p className="mt-1 text-sm text-gray-500">
            訪問数・診断結果・来場者傾向を一元管理する管理画面です。
          </p>
        </div>
      </header>

      {/* サマリーカード */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">総訪問数</p>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {analytics.totalPageViews.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-gray-400">全ページへのアクセス合計</p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">診断完了数</p>
            <p className="mt-2 text-3xl font-bold text-pink-600">
              {analytics.totalCount.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-gray-400">診断を完了した人数</p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">診断完了率</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {analytics.completionRate}
              <span className="text-base font-normal text-gray-500">%</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">訪問者のうち診断を完了した割合</p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">ハンドドリップ経験</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {handDripYesRate}
              <span className="text-base font-normal text-gray-500">%</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">目の前で見たことがある人の割合</p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">最多タイプ</p>
            <p className="mt-2 text-2xl font-bold text-rose-600">
              {analytics.topType ?? "-"}
            </p>
            <p className="mt-1 text-xs text-gray-400">最も多かった診断タイプ</p>
          </div>
        </div>
      </section>

      {/* 日別推移 */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">日別アクセス推移</h2>
        <p className="mt-1 text-xs text-gray-500">
          訪問数と診断完了数の日別トレンド
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.dailyStats}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pageViews"
                name="訪問数"
                stroke="#8b5cf6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="quizCompletions"
                name="診断完了"
                stroke="#ec4899"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ページ別アクセス数 */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">人気ページ TOP10</h2>
        <p className="mt-1 text-xs text-gray-500">
          どのページがよく見られているか
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.topPages} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="page" width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
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

      {/* 年代×タイプ分布 */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">年代×タイプ分布</h2>
        <p className="mt-1 text-xs text-gray-500">
          年代ごとに、どのタイプの診断結果が多かったかを積み上げ棒グラフで表示。
        </p>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageTypeChartData}>
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip />
              <Legend />
              {allTypes.map((type, idx) => (
                <Bar
                  key={type}
                  dataKey={type}
                  name={type}
                  stackId="ageType"
                  fill={COLORS[idx % COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 年代別 詳細サマリー */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">年代別 詳細サマリー</h2>
        <p className="mt-1 text-xs text-gray-500">
          各年代ごとの母数と、ハンドドリップ経験・スペシャルティ認知・タイプ分布のざっくり一覧。
        </p>

        <div className="mt-4 space-y-4">
          {analytics.ageStats
            .slice()
            .sort((a, b) => a.age.localeCompare(b.age))
            .map((age) => {
              const typeForAge = analytics.ageTypeStats
                .filter((s) => s.age === age.age)
                .sort((a, b) => b.count - a.count);

              return (
                <div
                  key={age.age}
                  className="rounded-lg border bg-gray-50 p-4 text-sm shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <div>
                      <p className="text-sm font-semibold">{age.age}</p>
                      <p className="text-xs text-gray-500">
                        回答数: {age.total} / ハンドドリップ経験: {age.handDripRate}% /
                        スペシャルティ認知: {age.specialtyKnowRate}%
                      </p>
                    </div>
                    {typeForAge[0] && (
                      <p className="text-xs text-gray-500">
                        最多タイプ:{" "}
                        <span className="font-semibold">{typeForAge[0].type}</span>{" "}
                        ({typeForAge[0].percentage}%)
                      </p>
                    )}
                  </div>

                  {typeForAge.length > 0 && (
                    <div className="mt-3 overflow-x-auto">
                      <table className="min-w-full text-left text-xs">
                        <thead>
                          <tr className="border-b text-[11px] text-gray-500">
                            <th className="px-2 py-1 font-medium">タイプ</th>
                            <th className="px-2 py-1 font-medium">人数</th>
                            <th className="px-2 py-1 font-medium">割合</th>
                          </tr>
                        </thead>
                        <tbody>
                          {typeForAge.map((t) => (
                            <tr key={`${age.age}-${t.type}`} className="border-b last:border-b-0">
                              <td className="px-2 py-1">{t.type}</td>
                              <td className="px-2 py-1">{t.count}</td>
                              <td className="px-2 py-1">{t.percentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </section>
    </main>
  );
}