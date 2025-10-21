import { FlavorRadar, QuizWeight } from "./types";

/** 回答(1〜5)の集合を {acidity,...} に落とすための配点マップ（超シンプル） */
export const QUESTION_TRAIT_MAP: Record<number, Partial<FlavorRadar>> = {
  1: { acidity: 1, aroma: 1 },        // 軽やか/フルーティ
  2: { body: 1, bitterness: 1 },      // ビター/重厚
  3: { acidity: 1 },                  // 酸味OK
  4: { sweet: 1 },                    // 甘さ好き
  5: { aroma: 1 },                    // 香り重視
  6: { aroma: 1 },                    // さらに香り
  7: { body: 1 },                     // ミルクでも負けない
  8: { bitterness: -1 },              // 苦味控えめ（マイナスで抑制）
  9: { sweet: 1, aroma: 1 },          // 温度変化の楽しさ
  10: { acidity: 1, sweet: 1 }        // 初心者に勧めやすい（明るく甘い）
};

/** 回答(id→1..5)から特性スコアを作る（正規化あり） */
export function buildTraitScore(ansOrderIndexed: Record<number, number>): FlavorRadar {
  const base: FlavorRadar = { acidity: 0, sweet: 0, body: 0, bitterness: 0, aroma: 0 };
  const counts: FlavorRadar = { acidity: 0, sweet: 0, body: 0, bitterness: 0, aroma: 0 };

  for (const [orderStr, val] of Object.entries(ansOrderIndexed)) {
    const order = Number(orderStr);
    const map = QUESTION_TRAIT_MAP[order];
    if (!map) continue;
    for (const k of Object.keys(map) as (keyof FlavorRadar)[]) {
      const weight = map[k] as number;
      base[k] += val * weight;     // 回答1..5をそのまま重み付け
      counts[k] += Math.abs(weight);
    }
  }
  // 0..5に正規化（回答が無い特性は0）
  (Object.keys(base) as (keyof FlavorRadar)[]).forEach((k) => {
    base[k] = counts[k] ? Math.max(0, Math.min(5, base[k] / counts[k])) : 0;
  });
  return base;
}

/** cos類似度っぽい単純スコア（重みとユーザ特性の近さ）*/
export function similarity(user: FlavorRadar, w: FlavorRadar) {
  // 期待プロファイル w を 0..1 に、ユーザも 0..1 にして差分をとる
  const keys: (keyof FlavorRadar)[] = ["acidity", "sweet", "body", "bitterness", "aroma"];
  let diff = 0;
  for (const k of keys) {
    const a = user[k] / 5;
    const b = w[k]; // DBのweightsは0..1前提
    diff += (a - b) * (a - b);
  }
  return -diff; // 小さいほど良い→マイナスで大きい方が良いに反転
}

/** 最も近いbean_keyを返す */
export function pickBestBean(user: FlavorRadar, weights: QuizWeight[]): string | null {
  if (!weights.length) return null;
  let best = weights[0].bean_key, bestScore = -Infinity;
  for (const w of weights) {
    const s = similarity(user, w.weights as FlavorRadar);
    if (s > bestScore) {
      bestScore = s;
      best = w.bean_key;
    }
  }
  return best;
}

