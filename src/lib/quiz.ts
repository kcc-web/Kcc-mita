// src/lib/quiz.ts
export type MBTI_Axis = "EI" | "SN" | "TF" | "JP";

export type Question = {
  id: number;
  axis: MBTI_Axis;
  text: string;
  leftLabel?: string;
  rightLabel?: string;
};

export const QUESTIONS: Question[] = [
  // 性格・価値観ベース（7問）
  { 
    id: 1, 
    axis: "TF", 
    text: "見た目や雰囲気よりも「説明」などを重視する。",
    leftLabel: "全くそう思わない",
    rightLabel: "とてもそう思う"
  },
  { 
    id: 2, 
    axis: "SN", 
    text: "新しいことに挑戦するのが好きだ。",
    leftLabel: "全くそう思わない",
    rightLabel: "とてもそう思う"
  },
  { 
    id: 3, 
    axis: "JP", 
    text: "計画よりもその場の雰囲気で動くタイプだ。",
    leftLabel: "全くそう思わない",
    rightLabel: "とてもそう思う"
  },
  { 
    id: 4, 
    axis: "SN", 
    text: "一つのことにじっくり集中できる。",
    leftLabel: "全くそう思わない",
    rightLabel: "とてもそう思う"
  },
  { 
    id: 5, 
    axis: "EI", 
    text: "人に話を聞いてもらうより、聞く方が多い。",
    leftLabel: "全くそう思わない",
    rightLabel: "とてもそう思う"
  },
  { 
    id: 6, 
    axis: "TF", 
    text: "日々の中で「小さなこだわり」を大切にしている。",
    leftLabel: "全くそう思わない",
    rightLabel: "とてもそう思う"
  },
  { 
    id: 7, 
    axis: "EI", 
    text: "周りの人を楽しませるのが好きだ。",
    leftLabel: "全くそう思わない",
    rightLabel: "とてもそう思う"
  },
  
  // コーヒー嗜好ベース（3問）
  { 
    id: 8, 
    axis: "TF", 
    text: "普段からミルクや砂糖を入れて飲むことが多い。",
    leftLabel: "全くそう思わない",
    rightLabel: "とてもそう思う"
  },
  { 
    id: 9, 
    axis: "SN", 
    text: "酸味を感じるコーヒーが好きか。",
    leftLabel: "全くそう思わない",
    rightLabel: "とてもそう思う"
  },
  { 
    id: 10, 
    axis: "JP", 
    text: "コーヒーは静かで落ち着いた空間で味わいたい。",
    leftLabel: "全くそう思わない",
    rightLabel: "とてもそう思う"
  },
];
