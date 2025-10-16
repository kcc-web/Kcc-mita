// 4軸キー
export type Axes = "brightness" | "texture" | "sweetness" | "aroma";

// 0..100
export type Scores = Record<Axes, number>;

export type BeanTypeKey = "ethiopia_washed" | "ethiopia_natural" | "kenya" | "guatemala" | "honduras";

export type BeanProfile = {
  key: BeanTypeKey;
  beanName: string;
  typeName: string;        // The Minimalist など
  tags: string[];
  desc: string;
  // ターゲット味覚プロファイル（中心値）
  profile: Scores;
  // 画像パス（任意: /lib/menu.ts 側の photo 優先）
  fallbackImage: string;
};

// 5タイプ定義
export const BEAN_TYPES: BeanProfile[] = [
  {
    key: "ethiopia_washed",
    beanName: "Ethiopia Washed",
    typeName: "The Minimalist",
    tags: ["Bright", "Sharp", "Clean", "Floral"],
    desc: "澄んだ感性と知性。無駄なく洗練された一杯を好むタイプ。",
    profile: { brightness: 80, texture: 70, sweetness: 40, aroma: 65 },
    fallbackImage: "/beans/ethiopia.jpg",
  },
  {
    key: "ethiopia_natural",
    beanName: "Ethiopia Natural",
    typeName: "The Dreamer",
    tags: ["Bright", "Soft", "Sweet", "Fruity"],
    desc: "自由で感性豊か。果実味と甘い余韻で想像力が広がる。",
    profile: { brightness: 75, texture: 40, sweetness: 80, aroma: 80 },
    fallbackImage: "/beans/ethiopia.jpg",
  },
  {
    key: "kenya",
    beanName: "Kenya",
    typeName: "The Challenger",
    tags: ["Deep", "Sharp", "Clean", "Fruity"],
    desc: "情熱と推進力。厚みのある果実感とキレを求める挑戦者。",
    profile: { brightness: 40, texture: 75, sweetness: 35, aroma: 70 },
    fallbackImage: "/beans/kenya.jpg",
  },
  {
    key: "guatemala",
    beanName: "Guatemala",
    typeName: "The Harmonist",
    tags: ["Deep", "Soft", "Sweet", "Floral"],
    desc: "調和と温かさ。やさしい甘さと落ち着きのある雰囲気。",
    profile: { brightness: 45, texture: 35, sweetness: 70, aroma: 55 },
    fallbackImage: "/beans/guatemala.jpg",
  },
  {
    key: "honduras",
    beanName: "Honduras",
    typeName: "The Grounded",
    tags: ["Deep", "Soft", "Sweet", "Clean"],
    desc: "安定感と安心。毎日に寄り添う、まろやかな一杯。",
    profile: { brightness: 35, texture: 45, sweetness: 75, aroma: 45 },
    fallbackImage: "/beans/honduras.jpg",
  },
];

// ユーザースコアとの距離（小さいほど近い）
const distance = (a: Scores, b: Scores) =>
  (a.brightness - b.brightness) ** 2 +
  (a.texture - b.texture) ** 2 +
  (a.sweetness - b.sweetness) ** 2 +
  (a.aroma - b.aroma) ** 2;

// 最も近いタイプを1つ返す
export function pickBeanType(scores: Scores): BeanProfile {
  return BEAN_TYPES.reduce((best, cur) =>
    distance(scores, cur.profile) < distance(scores, best.profile) ? cur : best
  , BEAN_TYPES[0]);
}

// --- ここから互換レイヤー（旧コード救済用） -------------------------

// 旧コードが import している型名に対応
export type MbtiType = "EN" | "IN" | "ES" | "IS";

// 旧コードが参照していた BeanKey に合わせた “レガシー” 型
// （※ 実体の5タイプとは別物。あくまで互換目的）
export type BeanKey = "ethiopia-washed" | "colombia" | "kenya" | "guatemala";

/**
 * 旧API: MBTIグループ -> レガシー豆スラッグ
 * 既存の QuizClient からの呼び出しを壊さないための簡易マッピング。
 * （5タイプ設計とは独立。/result 側では score を用いた5タイプ判定を行います）
 */
export function beanForType(t: MbtiType): BeanKey {
  const u = (t ?? "EN").toUpperCase();
  if (u.startsWith("EN")) return "ethiopia-washed";
  if (u.startsWith("ES")) return "kenya";
  if (u.startsWith("IS")) return "guatemala";
  // IN はレガシーでは Colombia を返す（データが無ければ /result 側でフォールバック画像が効きます）
  return "colombia";
}
