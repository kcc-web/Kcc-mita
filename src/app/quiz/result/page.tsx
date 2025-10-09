// /src/app/quiz/result/page.tsx
"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RESULT_MAP, MbtiType, BeanKey } from "@/lib/resultMap";

export default function ResultPage() {
  const sp = useSearchParams();
  const router = useRouter();

  // URL から type / bean を受け取る（ロジック未実装でもUIが出せる）
  const urlType = sp.get("type")?.toUpperCase() as MbtiType | null;
  const urlBean = sp.get("bean")?.toUpperCase() as BeanKey | null;

  // type が無い場合のフォールバック（仮に ENFP を表示）
  const type: MbtiType = useMemo(() => {
    if (urlType && RESULT_MAP[urlType]) return urlType;
    return "ENFP";
  }, [urlType]);

  // bean は type → RESULT_MAP から復元。URLの bean 指定があればそれを優先。
  const bean: BeanKey = useMemo(() => {
    if (urlBean) return urlBean;
    return RESULT_MAP[type].bean;
  }, [urlBean, type]);

  const meta = RESULT_MAP[type];

  return (
    <main className="max-w-lg mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        <Card className={["shadow-sm border", typeTone(type)].join(" ")}>
          <CardHeader className="text-center space-y-3">
              <Badge variant="secondary" className="text-xs px-2 py-1">あなたのタイプ</Badge>
                <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25 }}>
                <CardTitle className="text-3xl tracking-wide">{type}</CardTitle>
                </motion.div>
                <p className="text-muted-foreground">{meta.label}</p>
            </CardHeader>


          <CardContent className="space-y-6">
            {/* 短い説明 */}
            <p className="text-sm leading-relaxed text-foreground/80 text-center">
              {meta.desc}
            </p>

            {/* 推し一杯 */}
            <div className="rounded-2xl border p-4 bg-card/70 backdrop-blur-[2px]">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-xs text-muted-foreground mb-1">
                    おすすめの一杯</p>
                    <p className="text-lg font-semibold">
                        {beanToLabel(bean)} <span className="opacity-60 text-sm">({bean})</span>
                    </p>
                    </div>
                    <Button className="rounded-xl" onClick={() => router.push(`/menu?bean=${bean}`)}>
                    おすすめを見る ☕</Button>
                </div>
            </div>

            {/* アクション */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" onClick={() => router.push("/quiz")}>
                もう一度診断する
              </Button>
              <Button variant="secondary" onClick={() => router.push(`/menu?bean=${bean}`)}>
                まずはメニューを見る
              </Button>
            </div>

            {/* 備考 */}
            <p className="text-xs text-muted-foreground text-center pt-2">
              ※ 簡易診断です。気分やシーンで選び直してもOK。
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

// 表示用のラベル（必要に応じて /lib/types へ移動OK）
function beanToLabel(bean: BeanKey): string {
  switch (bean) {
    case "ETH_LIGHT": return "エチオピア（浅煎り）";
    case "COL_MEDIUM": return "コロンビア（中煎り）";
    case "KEN_DARK": return "ケニア（深煎り）";
    case "GUAT_FLAVOR": return "グアテマラ（フレーバー重視）";
    default: return bean;
  }
}

function typeTone(t: MbtiType) {
  const head = t[0]; // I/E
  const map: Record<string, string> = {
    E: "bg-orange-50 border-orange-200",
    I: "bg-sky-50 border-sky-200",
  };
  return map[head] ?? "bg-muted/30 border-foreground/10";
}
