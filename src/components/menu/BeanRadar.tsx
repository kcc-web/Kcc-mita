"use client";
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import type { MenuBean } from "@/lib/menu";

const JP: Record<keyof MenuBean["radar"], string> = {
  acidity: "酸味",
  sweetness: "甘み",
  body: "コク",
  aroma: "香り",
  aftertaste: "余韻",
};

export default function BeanRadar({ data }: { data: MenuBean["radar"] }) {
  const chart = (Object.keys(data) as (keyof MenuBean["radar"])[]).map((k) => ({ 
    axis: JP[k], 
    value: data[k] 
  }));
  
  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <RadarChart data={chart}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="axis" 
            tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 10]} 
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickCount={6}
          />
          <Radar 
            dataKey="value" 
            stroke="#ec4899" 
            fill="#fce7f3" 
            fillOpacity={0.6}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

