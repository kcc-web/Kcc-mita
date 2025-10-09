// /src/lib/resultMap.ts
export type MbtiType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export type BeanKey = "ETH_LIGHT" | "COL_MEDIUM" | "KEN_DARK" | "GUAT_FLAVOR";

export const RESULT_MAP: Record<MbtiType, {
  label: string; // タイプのニックネーム
  desc: string;  // 一言説明（短文）
  bean: BeanKey; // おすすめ豆キー（/menu 側と連携）
}> = {
  INTJ: { label: "戦略家タイプ", desc: "本質を射抜く分析で、最短距離を見つける。", bean: "KEN_DARK" },
  INTP: { label: "研究者タイプ", desc: "知の探求者。答えよりも良い問いを好む。", bean: "ETH_LIGHT" },
  ENTJ: { label: "統率者タイプ", desc: "決める覚悟と実行力。高い視座で前進。", bean: "KEN_DARK" },
  ENTP: { label: "発明家タイプ", desc: "ひらめきと実験。新しい当たり前を作る。", bean: "ETH_LIGHT" },

  INFJ: { label: "提唱者タイプ", desc: "静かな情熱で、理想を現実に近づける。", bean: "GUAT_FLAVOR" },
  INFP: { label: "仲介者タイプ", desc: "自分らしさを大切に、優しい選択をする。", bean: "GUAT_FLAVOR" },
  ENFJ: { label: "主人公タイプ", desc: "人を巻き込み、場の温度を一段上げる。", bean: "COL_MEDIUM" },
  ENFP: { label: "冒険者タイプ", desc: "ワクワクと好奇心で、世界をカラフルに。", bean: "COL_MEDIUM" },

  ISTJ: { label: "管理者タイプ", desc: "丁寧で堅実。信頼を積み上げる職人肌。", bean: "COL_MEDIUM" },
  ISFJ: { label: "擁護者タイプ", desc: "気配り上手。安心できる土台をつくる。", bean: "GUAT_FLAVOR" },
  ESTJ: { label: "幹事長タイプ", desc: "段取りと推進で、物事を着地させる。", bean: "KEN_DARK" },
  ESFJ: { label: "ホスピタリティ", desc: "場の空気を読み、みんなを笑顔に。", bean: "COL_MEDIUM" },

  ISTP: { label: "妙技タイプ", desc: "手を動かして理解するフィクサー。", bean: "ETH_LIGHT" },
  ISFP: { label: "アトリエタイプ", desc: "しなやかな感性で“らしさ”を描く。", bean: "GUAT_FLAVOR" },
  ESTP: { label: "切り込み隊長", desc: "瞬発力と体験で、状況を切り拓く。", bean: "KEN_DARK" },
  ESFP: { label: "エンタメタイプ", desc: "今この瞬間を、最高に楽しむ天才。", bean: "COL_MEDIUM" },
};

export function beanForType(type: MbtiType): BeanKey {
  return RESULT_MAP[type].bean;
}
