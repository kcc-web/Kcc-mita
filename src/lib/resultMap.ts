// src/lib/resultMap.ts - 改善版：均等な分布を実現（2025年11月版）

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

// ========== 均等に分布するよう調整された6タイプ ==========
export const BEAN_TYPES: BeanProfile[] = [
  // 1. Classic（深煎り・まろやか・適度な甘さ・穏やか）
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
      brightness: 30,  // 25 → 30（少し明るめに調整）
      texture: 35,     // 変更なし
      sweetness: 45,   // 変更なし
      aroma: 35,       // 変更なし
    },
    fallbackImage: "/beans/kcc-blend.jpg",
    roast: "深煎り",
    price: "¥700",
  },

  // 2. Balancer（中央バランス型）
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
      brightness: 50,  // 55 → 50（中央値に）
      texture: 40,     // 35 → 40（中央寄りに）
      sweetness: 60,   // 65 → 60（中央寄りに）
      aroma: 50,       // 45 → 50（完全中央に）
    },
    fallbackImage: "/beans/honduras.jpg",
    roast: "浅煎り",
    price: "¥700",
  },

  // 3. Seeker（クリアで明るい探求者）
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
      brightness: 70,  // 75 → 70（少し中央寄りに）
      texture: 60,     // 65 → 60（少し中央寄りに）
      sweetness: 35,   // 変更なし
      aroma: 35,       // 変更なし
    },
    fallbackImage: "/beans/ethiopia-washed.jpg",
    roast: "浅煎り",
    price: "¥700",
  },

  // 4. Dreamer（華やかで甘いフルーティ）
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
      brightness: 55,  // 50 → 55（少し明るく）
      texture: 35,     // 40 → 35（Soft寄りに）
      sweetness: 65,   // 80 → 65（現実的な範囲に）
      aroma: 70,       // 80 → 70（現実的な範囲に）
    },
    fallbackImage: "/beans/ethiopia.jpg",
    roast: "浅煎り",
    price: "¥700",
  },

  // 5. Adventurer（トロピカルで濃厚）
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
      brightness: 45,  // 40 → 45（少し明るく）
      texture: 50,     // 55 → 50（中央に）
      sweetness: 70,   // 85 → 70（現実的な範囲に）
      aroma: 65,       // 70 → 65（調整）
    },
    fallbackImage: "/beans/brazil.jpg",
    roast: "浅煎り",
    price: "¥700",
  },

  // 6. Pioneer（実験的で唯一無二）
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
      brightness: 30,  // 35 → 30（少し深めに）
      texture: 70,     // 75 → 70（少し中央寄りに）
      sweetness: 30,   // 25 → 30（少し上げる）
      aroma: 75,       // 85 → 75（少し現実的に）
    },
    fallbackImage: "/beans/colombia-milan.jpg",
    roast: "浅煎り",
    price: "¥1,000",
  },
];

// ===== 距離計算の調整（豆ごとの PRIOR＋Pioneer特別ロジック） =====

const PRIOR: Record<BeanTypeKey, number> = {
  classic: 0.90,      // 0.85 → 0.90（少し出やすく）
  balancer: 1.00,     // 0.95 → 1.00（基準値）
  seeker: 1.05,       // 変更なし
  dreamer: 0.85,      // 1.3 → 0.85（大幅に出やすく！）
  adventurer: 0.95,   // 1.05 → 0.95（少し出やすく）
  pioneer: 1.20,      // 1.25 → 1.20（少し出やすく、レア感維持）
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
      // 全軸が極端に振れている人 → 他より少し選ばれやすく
      return raw * 0.85;
    }

    // それ以外は PRIOR どおり
    return raw * PRIOR.pioneer;
  }

  // それ以外（Classic / Balancer / Seeker / Dreamer / Adventurer）は PRIOR に従う
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