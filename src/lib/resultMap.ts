// src/lib/resultMap.ts - プロファイル位置調整版（PRIOR最小限）

export type Axes = "brightness" | "texture" | "sweetness" | "aroma";
export type Scores = Record<Axes, number>;
export type BeanTypeKey =
  | "classic"
  | "balancer"
  | "seeker"
  | "dreamer"
  | "adventurer"
  | "pioneer";

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

// ========== プロファイル位置で分布をコントロール ==========
// コンセプト：ユーザーの回答は中央（50）に集まるので、
// 出したいタイプは中央寄り、出したくないタイプは極端な位置に配置

export const BEAN_TYPES: BeanProfile[] = [
  // 1. Classic - 中央やや下（出やすい）
  {
    key: "classic",
    beanName: "KCC Blend",
    beanId: "kcc-blend",
    typeName: "Classic",
    typeNameJa: "クラシック",
    tagline: "安心と口当たりの一杯",
    tags: ["Deep", "Rich", "Cozy", "Nutty"],
    desc: "香ばしさと力強さ。落ち着く「定番のよさ」を求めるあなたへ。",
    detailedDesc: `深煎りの豊かな口当たりとナッツのような香ばしさが特徴。
朝のリセットや、仕事の合間にほっと一息つきたいときにぴったりです。
ミルクとの相性も抜群で、カフェラテにしても存在感を失いません。
伝統的なコーヒーの味わいを大切にする、信頼できる一杯です。`,
    profile: {
      brightness: 42,  // 中央やや下
      texture: 75,     // ほぼ中央
      sweetness: 79,   // ほぼ中央
      aroma: 89,       // 中央やや下
    },
    fallbackImage: "/beans/kcc-blend.jpg",
    roast: "深煎り",
    price: "¥700",
  },

  // 2. Balancer - 完全中央（適度に出る）
  {
    key: "balancer",
    beanName: "Honduras Washed",
    beanId: "honduras-washed",
    typeName: "Balancer",
    typeNameJa: "バランサー",
    tagline: "やさしく調和のとれた軽やかさ",
    tags: ["Soft", "Clean", "Balanced", "Gentle"],
    desc: "飲みやすく、日常に寄り添うクリーンさ。誰とでも仲良くなれる優しさ。",
    detailedDesc: `酸味・甘味・苦味のバランスが絶妙で、クセがなく飲みやすい一杯。
浅煎りながらもまろやかで、コーヒー初心者の方にもおすすめです。
どんなシーンにも溶け込み、リラックスした時間を演出します。
毎日飲んでも飽きない、安定感のある味わいです。`,
    profile: {
      brightness: 45,  // 完全中央
      texture: 36,     // 完全中央
      sweetness: 59,   // 完全中央
      aroma: 46,       // 完全中央
    },
    fallbackImage: "/beans/honduras.jpg",
    roast: "浅煎り",
    price: "¥700",
  },

  // 3. Seeker - 中央やや上（出やすい）
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
    profile: {
      brightness: 50,  // 中央やや上
      texture: 50,     // ほぼ中央
      sweetness: 50,   // 中央やや下
      aroma: 50,       // 中央やや下
    },
    fallbackImage: "/beans/ethiopia-washed.jpg",
    roast: "浅煎り",
    price: "¥700",
  },

  // 4. Dreamer - 極端な位置（出にくい）
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
甘味が豊かで、まるでフルーツジュースのような爽やかさです。
自由で創造的な発想を刺激し、リラックスした時間を彩ります。
個性的なコーヒーを楽しみたい、冒険心のあるあなたにぴったりです。`,
    profile: {
      brightness: 68,  // 極端に高い
      texture: 50,     // 極端に低い
      sweetness: 72,   // 極端に高い
      aroma: 78,       // 極端に高い
    },
    fallbackImage: "/beans/ethiopia.jpg",
    roast: "浅煎り",
    price: "¥700",
  },

  // 5. Adventurer - 極端な位置（出にくい）
  {
    key: "adventurer",
    beanName: "Brazil Anaerobic Natural",
    beanId: "brazil-anaerobic",
    typeName: "Adventurer",
    typeNameJa: "アドベンチャラー",
    tagline: "トロピカルで濃厚な冒険",
    tags: ["Tropical", "Creamy", "Sweet", "Exotic"],
    desc: "マンゴーとワイルドハニー。クリーミーな甘さに包まれる体験。",
    detailedDesc: `嫌気性発酵による独特のトロピカルフルーツの香り。
マンゴー、ブラックベリー、パッションフルーツの複雑な甘さが層になって現れます。
クリーミーなボディと長く続く甘い余韻が特徴で、
デザートコーヒーとしても楽しめる、特別な体験を提供します。`,
    profile: {
      brightness: 56,  // 極端に低い
      texture: 52,     // やや高い
      sweetness: 45,   // 極端に高い
      aroma: 47,       // 極端に高い
    },
    fallbackImage: "/beans/brazil.jpg",
    roast: "浅煎り",
    price: "¥700",
  },

  // 6. Pioneer - さらに極端（レア）
  {
    key: "pioneer",
    beanName: "Colombia Milan Culturing NG",
    beanId: "colombia-milan",
    typeName: "Pioneer",
    typeNameJa: "パイオニア",
    tagline: "実験的で唯一無二の体験（数量限定）",
    tags: ["Unique", "Experimental", "Complex", "Bold"],
    desc: "未知の発酵プロセス。前例のない味わいを求める先駆者へ。",
    detailedDesc: `Culturing NG プロセスによる、まだ誰も体験したことのない味わい。
実験的な発酵技術が生み出す、予測不可能な風味のプロファイル。
伝統的なコーヒーの枠を超えた、挑戦的で刺激的な一杯です。
新しい可能性を追求する、真の冒険者のためのコーヒーです。`,
    profile: {
      brightness: 28,  // 極端に低い
      texture: 75,     // 極端に高い
      sweetness: 27,   // 極端に低い
      aroma: 82,       // 極端に高い
    },
    fallbackImage: "/beans/colombia-milan.jpg",
    roast: "浅煎り",
    price: "¥1,000",
  },
];

// ===== PRIORは最小限の微調整のみ =====

const PRIOR: Record<BeanTypeKey, number> = {
  classic: 0.80,      // わずかに優遇
  balancer: 0.95,     // 基準値
  seeker: 0.95,       // わずかに優遇
  dreamer: 1.00,      // わずかにペナルティ
  adventurer: 1.5,   // わずかにペナルティ
  pioneer: 1.1,      // レア感維持
};

const distance = (a: Scores, b: Scores, key: BeanTypeKey) => {
  const raw =
    (a.brightness - b.brightness) ** 2 +
    (a.texture - b.texture) ** 2 +
    (a.sweetness - b.sweetness) ** 2 +
    (a.aroma - b.aroma) ** 2;

  // Pioneerだけは「極端な回答ならご褒美枠」として優遇
  if (key === "pioneer") {
    const isExtreme =
      (a.brightness > 70 || a.brightness < 30) &&
      (a.texture > 70 || a.texture < 30) &&
      (a.sweetness > 70 || a.sweetness < 30) &&
      (a.aroma > 70 || a.aroma < 30);

    if (isExtreme) {
      return raw * 0.85;
    }
    return raw * PRIOR.pioneer;
  }

  return raw * PRIOR[key];
};

// 最も近いタイプを1つ返す
export function pickBeanType(scores: Scores): BeanProfile {
  return BEAN_TYPES.reduce((best, cur) => {
    const curDist = distance(scores, cur.profile, cur.key);
    const bestDist = distance(scores, best.profile, best.key);
    return curDist < bestDist ? cur : best;
  }, BEAN_TYPES[0]);
}

// --- 旧コード互換レイヤー ---
export type MbtiType = "EN" | "IN" | "ES" | "IS";
export type BeanKey =
  | "ethiopia-washed"
  | "colombia-milan"
  | "brazil-anaerobic"
  | "kcc-blend"
  | "honduras-washed"
  | "ethiopia-natural";

export function beanForType(t: MbtiType): BeanKey {
  const u = (t ?? "EN").toUpperCase();
  if (u.startsWith("EN")) return "ethiopia-washed";
  if (u.startsWith("ES")) return "colombia-milan";
  if (u.startsWith("IS")) return "kcc-blend";
  return "honduras-washed";
}