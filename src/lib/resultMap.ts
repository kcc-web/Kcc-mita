// src/lib/resultMap.ts
// 4軸キー
export type Axes = "brightness" | "texture" | "sweetness" | "aroma";

// 0..100
export type Scores = Record<Axes, number>;

export type BeanTypeKey = "classic" | "balancer" | "seeker" | "dreamer" | "pioneer";

export type BeanProfile = {
  key: BeanTypeKey;
  beanName: string;           
  beanId: string;             
  typeName: string;           
  typeNameJa: string;         
  tagline: string;            
  tags: string[];             
  desc: string;               
  detailedDesc: string;       
  profile: Scores;            
  fallbackImage: string;      
  roast?: string;             
  price?: string;             
};

// 5タイプ定義
export const BEAN_TYPES: BeanProfile[] = [
  {
    key: "classic",
    beanName: "三田祭ブレンド",
    beanId: "guatemala",
    typeName: "Classic",
    typeNameJa: "クラシック",
    tagline: "安心とコクの一杯",
    tags: ["Deep", "Rich", "Cozy", "Nutty"],
    desc: "香ばしさと力強さ。落ち着く「定番のよさ」を求めるあなたへ。",
    detailedDesc: `深煎りの豊かなコクとナッツのような香ばしさが特徴。
朝のリセットや、仕事の合間にほっと一息つきたいときにぴったりです。
ミルクとの相性も抜群で、カフェラテにしても存在感を失いません。
伝統的なコーヒーの味わいを大切にする、信頼できる一杯です。`,
    profile: { brightness: 35, texture: 70, sweetness: 55, aroma: 60 },
    fallbackImage: "/beans/guatemala.jpg",
    roast: "深煎り",
    price: "¥700",
  },
  {
    key: "balancer",
    beanName: "Honduras Washed",
    beanId: "honduras",
    typeName: "Balancer",
    typeNameJa: "バランサー",
    tagline: "やさしく調和のとれた軽やかさ",
    tags: ["Soft", "Clean", "Balanced", "Gentle"],
    desc: "飲みやすく、日常に寄り添うクリーンさ。誰とでも仲良くなれる優しさ。",
    detailedDesc: `酸味・甘み・苦味のバランスが絶妙で、クセがなく飲みやすい一杯。
浅煎りながらもまろやかで、コーヒー初心者の方にもおすすめです。
どんなシーンにも溶け込み、リラックスした時間を演出します。
毎日飲んでも飽きない、安定感のある味わいです。`,
    profile: { brightness: 50, texture: 40, sweetness: 65, aroma: 50 },
    fallbackImage: "/beans/honduras.jpg",
    roast: "浅煎り",
    price: "¥700",
  },
  {
    key: "seeker",
    beanName: "Ethiopia Washed",
    beanId: "ethiopia-washed",
    typeName: "Seeker",
    typeNameJa: "シーカー",
    tagline: "誠実に味の輪郭を追う探求者",
    tags: ["Bright", "Sharp", "Clear", "Floral"],
    desc: "澄んだ香りとキレ。「味の線」が好きなあなたへ。",
    detailedDesc: `ウォッシュド精製による透明感のある味わいが特徴。
フローラルな香りと明るい酸味が調和し、クリアな余韻を残します。
一口ごとに味の輪郭がはっきりと感じられ、コーヒーの奥深さを探求できます。
スペシャルティコーヒーの魅力を存分に味わいたい方におすすめです。`,
    profile: { brightness: 80, texture: 70, sweetness: 40, aroma: 70 },
    fallbackImage: "/beans/ethiopia.jpg",
    roast: "浅煎り",
    price: "¥700",
  },
  {
    key: "dreamer",
    beanName: "Ethiopia Natural",
    beanId: "ethiopia-natural",
    typeName: "Dreamer",
    typeNameJa: "ドリーマー",
    tagline: "自由で華やかな果実味",
    tags: ["Bright", "Soft", "Sweet", "Fruity"],
    desc: "ベリーや花のニュアンス。心が弾むフルーティな一杯。",
    detailedDesc: `ナチュラル精製ならではの、ベリーやワインのような華やかな香り。
甘みが豊かで、まるでフルーツジュースのような爽やかさです。
自由で創造的な発想を刺激し、リラックスした時間を彩ります。
個性的なコーヒーを楽しみたい、冒険心のあるあなたにぴったりです。`,
    profile: { brightness: 75, texture: 40, sweetness: 80, aroma: 85 },
    fallbackImage: "/beans/ethiopia.jpg",
    roast: "浅煎り",
    price: "¥700",
  },
  {
    key: "pioneer",
    beanName: "Mirai Seeds Red Catuai Fruity",
    beanId: "kenya",
    typeName: "Pioneer",
    typeNameJa: "パイオニア",
    tagline: "「今だけ」に出会える特別な果実味（数量限定）",
    tags: ["Deep", "Sharp", "Fruity", "Unique"],
    desc: "未来志向の冒険者へ。限定の特別なフルーティさを体験。",
    detailedDesc: `数量限定の特別なロット。Red Catuai種ならではの個性的な果実味が際立ちます。
ブラックカラントやグレープフルーツのような複雑な香りと、
力強い酸味が特徴で、一度飲んだら忘れられない印象を残します。
新しい体験を求める、先駆者のあなたへ贈る特別な一杯です。`,
    profile: { brightness: 40, texture: 80, sweetness: 35, aroma: 75 },
    fallbackImage: "/beans/kenya.jpg",
    roast: "浅煎り",
    price: "¥1,000",
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
export type MbtiType = "EN" | "IN" | "ES" | "IS";
export type BeanKey = "ethiopia-washed" | "colombia" | "kenya" | "guatemala";

export function beanForType(t: MbtiType): BeanKey {
  const u = (t ?? "EN").toUpperCase();
  if (u.startsWith("EN")) return "ethiopia-washed";
  if (u.startsWith("ES")) return "kenya";
  if (u.startsWith("IS")) return "guatemala";
  return "colombia";
}

