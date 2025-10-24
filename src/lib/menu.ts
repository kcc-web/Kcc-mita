import { Bean } from "@/types/bean";

// カテゴリー追加
export type BeanCategory = "normal" | "special";

export interface MenuBean extends Bean {
  category: BeanCategory;
  roaster?: string;     // 焙煎者（Passage / Papelburg / Mirai Seeds）
  roastLevel?: string;  // 焙煎度（浅煎り / 深煎り）
  price: string;        // 価格
  stock?: "available" | "limited" | "soldout"; // 在庫状況
}

export const BEANS: MenuBean[] = [
  // ========== Normal（通常ライン） ==========
  {
    id: "honduras-washed",
    key: "honduras",
    name: "Honduras Washed",
    origin: "Honduras / Marcala",
    elevation: "1,400–1,600m",
    variety: ["Catuai", "Bourbon"],
    flavor: ["クリーン", "やさしい甘さ", "まろやか"],
    photo: "/beans/honduras.jpg",
    radar: { acidity: 5, sweetness: 7, body: 5, aroma: 6, aftertaste: 6 },
    process: "Washed",
    description: "クセがなく飲みやすい。やさしい甘さとまろやかな口当たり。",
    category: "normal",
    roaster: "Passage",
    roastLevel: "浅煎り",
    price: "¥700",
    stock: "available",
  },
  {
    id: "ethiopia-natural",
    key: "ethiopia-natural",
    name: "Ethiopia Natural",
    origin: "Ethiopia / Yirgacheffe",
    elevation: "1,800–2,000m",
    variety: ["Heirloom"],
    flavor: ["ブルーベリー", "ストロベリー", "ワイン"],
    photo: "/beans/ethiopia.jpg",
    radar: { acidity: 7, sweetness: 9, body: 5, aroma: 10, aftertaste: 8 },
    process: "Natural",
    description: "ナチュラル精製ならではの華やかな果実味。ベリーやワインのような甘い香り。",
    category: "normal",
    roaster: "Passage",
    roastLevel: "浅煎り",
    price: "¥700",
    stock: "available",
  },
  {
    id: "ethiopia-washed",
    key: "ethiopia-washed",
    name: "Ethiopia Washed",
    origin: "Ethiopia / Sidama",
    elevation: "1,900–2,100m",
    variety: ["Heirloom"],
    flavor: ["ベルガモット", "シトラス", "フローラル"],
    photo: "/beans/ethiopia.jpg",
    radar: { acidity: 8, sweetness: 7, body: 4, aroma: 9, aftertaste: 6 },
    process: "Washed",
    description: "ウォッシュド精製による透明感のある味わい。フローラルな香りと明るい酸味。",
    category: "normal",
    roaster: "Passage",
    roastLevel: "浅煎り",
    price: "¥700",
    stock: "available",
  },
  {
    id: "mitasai-blend",
    key: "guatemala",  // resultMapとの互換性のため
    name: "三田祭ブレンド",
    origin: "Guatemala / Antigua",
    elevation: "1,500–1,700m",
    variety: ["Bourbon", "Caturra"],
    flavor: ["カカオ", "スパイス", "香ばしさ"],
    photo: "/beans/guatemala.jpg",
    radar: { acidity: 6, sweetness: 6, body: 7, aroma: 7, aftertaste: 6 },
    process: "Washed",
    description: "深煎りの豊かなコク。カカオやスパイスのような香ばしさが特徴。",
    category: "normal",
    roaster: "Papelburg",
    roastLevel: "深煎り",
    price: "¥700",
    stock: "available",
  },

  // ========== Special（限定ライン） ==========
  {
    id: "red-catuai-fruity",
    key: "kenya",  // resultMapとの互換性のため
    name: "Red Catuai Fruity",
    origin: "Kenya / Nyeri",
    elevation: "1,700–2,000m",
    variety: ["SL28", "SL34"],
    flavor: ["ブラックカラント", "グレープフルーツ", "明るい酸"],
    photo: "/beans/kenya.jpg",
    radar: { acidity: 9, sweetness: 6, body: 5, aroma: 9, aftertaste: 7 },
    process: "Washed",
    description: "力強い酸味と複雑な果実味。ブラックカラントやグレープフルーツのような個性的な香り。",
    category: "special",
    roaster: "Mirai Seeds",
    roastLevel: "浅煎り",
    price: "¥1,000",
    stock: "limited",
  },
];

export const WAFFLE = {
  id: "waffle",
  name: "ベルギーワッフル",
  flavor: ["バター", "はちみつ", "香ばしさ"],
  photo: "/beans/waffle.jpg",
  description: "コーヒーにぴったりの焼きたてワッフル。バターの風味とはちみつの甘さが絶妙。",
  price: "¥500",
};

// カテゴリー別にフィルタリングするヘルパー
export const getNormalBeans = () => BEANS.filter((b) => b.category === "normal");
export const getSpecialBeans = () => BEANS.filter((b) => b.category === "special");

export default BEANS;