export type MBTI_Axis = "EI" | "SN" | "TF" | "JP";

export type Question = {
  id: number;
  axis: MBTI_Axis;
  text: string;
};

export const QUESTIONS: Question[] = [
  { id: 1, axis: "EI", text: "人といるより、一人の時間でリフレッシュすることが多い。" },
  { id: 2, axis: "EI", text: "初対面の人と話すのは得意な方だ。" },
  { id: 3, axis: "SN", text: "抽象的なアイデアよりも、現実的な情報を好む。" },
  { id: 4, axis: "SN", text: "細かい部分よりも全体像を見る方が得意だ。" },
  { id: 5, axis: "TF", text: "物事を判断するとき、感情より論理を重視する。" },
  { id: 6, axis: "TF", text: "他人の感情に強く共感する方だ。" },
  { id: 7, axis: "JP", text: "予定を立てて動くことが好きだ。" },
  { id: 8, axis: "JP", text: "直感で動くタイプだと思う。" },
  { id: 9, axis: "SN", text: "過去よりも未来の可能性に目を向ける。" },
  { id: 10, axis: "EI", text: "大勢の中でもエネルギーを感じる。" },
];
