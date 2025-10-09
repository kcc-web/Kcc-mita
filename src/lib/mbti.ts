// /src/lib/mbti.ts
import type { Question, MBTI_Axis } from "@/lib/quiz";

export type MbtiType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

// 高スコア＝右側 (E/N/F/P) に寄与、になるよう
// 右側に寄与しない設問（= 左側 I/S/T/J を表す設問）を“反転”する
const REVERSE_IDS = new Set<number>([
  1, // 「一人でリフレッシュ」→ I（左）なので反転
  3, // 「現実的情報を好む」→ S（左）
  5, // 「感情より論理」→ T（左）
  7, // 「予定を立てるのが好き」→ J（左）
]);

const AXIS_RIGHT: Record<MBTI_Axis, "E"|"N"|"F"|"P"> = {
  EI: "E",
  SN: "N",
  TF: "F",
  JP: "P",
};
const AXIS_LEFT: Record<MBTI_Axis, "I"|"S"|"T"|"J"> = {
  EI: "I",
  SN: "S",
  TF: "T",
  JP: "J",
};

/** 1〜5回答を集計して4文字タイプを返す（3が閾値） */
export function computeMbtiType(questions: Question[], answers: number[]): MbtiType {
  const sums: Record<MBTI_Axis, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const counts: Record<MBTI_Axis, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };

  questions.forEach((q, i) => {
    const raw = answers[i] ?? 3; // 未回答は中立扱い
    const val = REVERSE_IDS.has(q.id) ? 6 - raw : raw; // 反転: 1↔5, 2↔4, 3そのまま
    sums[q.axis] += val;
    counts[q.axis] += 1;
  });

  const letters = (["EI","SN","TF","JP"] as MBTI_Axis[]).map((axis) => {
    const avg = sums[axis] / Math.max(1, counts[axis]); // 1〜5
    return avg > 3 ? AXIS_RIGHT[axis] : AXIS_LEFT[axis];
  });

  return letters.join("") as MbtiType;
}
