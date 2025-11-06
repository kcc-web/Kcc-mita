// src/app/admin/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type Analytics = {
  totalCount: number;
  typeDistribution: { type: string; count: number; percentage: number }[];
  ageDistribution: { age: string; count: number }[];
  handDripRate: { yes: number; no: number };
  specialtyKnowledge: { know: number; heard: number; unknown: number };
};

const COLORS = ["#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from("quiz_results")
        .select("*");

      if (error) throw error;

      // 集計処理
      const totalCount = data.length;

      // タイプ別分布
      const typeCounts: Record<string, number> = {};
      data.forEach((row) => {
        typeCounts[row.result_type] = (typeCounts[row.result_type] || 0) + 1;
      });
      const typeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / totalCount) * 100),
      }));

      // 年代別分布
      const ageCounts: Record<string, number> = {};
      data.forEach((row) => {
        if (row.age_group) {
          ageCounts[row.age_group] = (ageCounts[row.age_group] || 0) + 1;
        }
      });
      const ageDistribution = Object.entries(ageCounts).map(([age, count]) => ({ age, count }));

      // ハンドドリップ経験率
      const handDripRate = {
        yes: data.filter((r) => r.seen_hand_drip).length,
        no: data.filter((r) => !r.seen_hand_drip).length,
      };

      // スペシャルティ認知度
      const specialtyKnowledge = {
        know: data.filter((r) => r.known_specialty === "know").length,
        heard: data.filter((r) => r.known_specialty === "heard").length,
        unknown: data.filter((r) => r.known_specialty === "unknown").length,
      };

      setAnalytics({
        totalCount,
        typeDistribution,
        ageDistribution,
        handDripRate,
        specialtyKnowledge,
      });
    } catch (err) {
      console.error("集計エラー:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">読み込み中...</div>;
  }

  if (!analytics) {
    return <div className="p-6 text-center">データがありません</div>;
  }

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      <h1 className="text-3xl font-bold">診断結果アナリティクス</h1>

      {/* サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">総診断数</p>
          <p className="text-3xl font-bold text-pink-600">{analytics.totalCount}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">ハンドドリップ経験率</p>
          <p className="text-3xl font-bold text-blue-600">
            {Math.round((analytics.handDripRate.yes / analytics.totalCount) * 100)}%
          </p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">スペシャルティ認知</p>
          <p className="text-3xl font-bold text-green-600">
            {Math.round((analytics.specialtyKnowledge.know / analytics.totalCount) * 100)}%
          </p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">最多タイプ</p>
          <p className="text-2xl font-bold text-purple-600">
            {analytics.typeDistribution.sort((a, b) => b.count - a.count)[0]?.type || "-"}
          </p>
        </div>
      </div>

      {/* タイプ別分布 */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">タイプ別分布</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.typeDistribution}>
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ec4899" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 年代別分布 */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">年代別分布</h2>
        <ResponsiveContainer width="100%" height={300}>
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}