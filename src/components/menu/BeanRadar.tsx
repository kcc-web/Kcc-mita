"use client";
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import type { Bean } from "@/types/bean";

const JP: Record<keyof Bean["radar"], string> = {
  acidity: "酸味",
  sweetness: "甘み",
  body: "コク",
  aroma: "香り",
  aftertaste: "余韻",
};

export default function BeanRadar({ data }: { data: Bean["radar"] }) {
  const chart = (Object.keys(data) as (keyof Bean["radar"])[]).map((k) => ({ k, v: data[k] }));
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <RadarChart data={chart}>
          <PolarGrid />
          <PolarAngleAxis dataKey="k" tickFormatter={(k) => JP[k as keyof typeof JP]} />
          <PolarRadiusAxis angle={90} domain={[0, 10]} />
          <Radar dataKey="v" />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

