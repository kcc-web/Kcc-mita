import { Bean } from "@/types/bean";

export type BeanCategory = "normal" | "special";

export interface MenuBean extends Bean {
  category: BeanCategory;
  roaster?: string;
  roastLevel?: string;
  price: string;
  stock?: "available" | "limited" | "soldout";
  producer?: string;
  farm?: string;
  region?: string;
  process: string;
  altitude: string;
  tasteNote: string[];
}

export const BEANS: MenuBean[] = [
  // ========== Normal（通常ライン）- All ¥700 ==========
  
  // Passage - Honduras Washed
  {
    id: "honduras-washed",
    key: "honduras",
    name: "Honduras Washed",
    origin: "Honduras",
    elevation: "1,650m",
    variety: ["Pacas"],
    flavor: ["Apricot", "Persimmon", "Pear"],
    tasteNote: ["Apricot", "Persimmon", "Pear", "Lemon", "Honey"],
    photo: "/beans/honduras.webp",
    radar: { 
      acidity: 6,    // レモンの明るい酸味
      sweetness: 7,  // ハチミツの甘さ
      body: 5,       // ミディアムボディ
      aroma: 7,      // フルーツの香り
      aftertaste: 8  // クリーンな余韻
    },
    process: "Fully Washed",
    altitude: "1,650m",
    description: "杏、柿、洋梨のような優しい甘さとレモンの明るさ。ハチミツのような滑らかな余韻。",
    category: "normal",
    roaster: "Passage",
    roastLevel: "浅煎り",
    price: "¥700",
    stock: "available",
    producer: "Miguel Armando Sagastume",
    farm: "Finca Los Cedros",
    region: "El Sauce, Santa Barbara",
  },

  // Passage - Ethiopia Natural
  {
    id: "ethiopia-natural",
    key: "ethiopia-natural",
    name: "Ethiopia Natural",
    origin: "Ethiopia",
    elevation: "2,050-2,100m",
    variety: ["Ethiopian Heirloom"],
    flavor: ["Floral", "White Peach", "Cranberry"],
    tasteNote: ["Floral", "White Peach", "Cranberry", "Lime",],
    photo: "/beans/ethiopia.webp",
    radar: { 
      acidity: 8,    // ライムの爽やかな酸味
      sweetness: 7,  // 白桃の甘さ
      body: 5,       // ミディアム～フル
      aroma: 7,     // 華やかなフローラル
      aftertaste: 7  // スパイシーな余韻
    },
    process: "Natural",
    altitude: "2,050-2,100m",
    description: "ジャスミンの花の香りと白桃の甘さ。レモンのフルーティな酸味",
    category: "normal",
    roaster: "Passage",
    roastLevel: "浅煎り",
    price: "¥700",
    stock: "available",
    region: "Gedeb, Yirgacheffe",
  },

  // Passage - Ethiopia Washed
  {
    id: "ethiopia-washed",
    key: "ethiopia-washed",
    name: "Ethiopia Washed",
    origin: "Ethiopia",
    elevation: "2,050-2,100m",
    variety: ["Ethiopian Heirloom"],
    flavor: ["Lemon", "Jasmine", "White Peach"],
    tasteNote: ["Lemon", "White Peach", "Jasmine", "Honey",],
    photo: "/beans/ethiopia-washed.webp",
    radar: { 
      acidity: 7,    // レモンの明るく爽やかな酸味
      sweetness: 7,  // ハチミツと白桃の甘さ
      body: 4,       // ライトボディ
      aroma: 6,      // ジャスミンの香り
      aftertaste: 7  // スパイシーでクリーンな余韻
    },
    process: "Fully Washed",
    altitude: "2,050-2,100m",
    description: "レモンの爽やかな酸味とジャスミンの優雅な香り。白桃とハチミツの甘さにスパイスが調和。",
    category: "normal",
    roaster: "Passage",
    roastLevel: "浅煎り",
    price: "¥700",
    stock: "available",
    region: "Gedeb, Yirgacheffe",
  },

  // Mirai Seeds - Brazil Anaerobic Natural
  {
    id: "brazil-anaerobic",
    key: "brazil",
    name: "Brazil Anaerobic Natural",
    origin: "Brazil",
    elevation: "1,100m",
    variety: ["Red Catuai"],
    flavor: ["Mango", "Blackberry", "Passion Fruit"],
    tasteNote: ["Mango", "Blackberry", "Passion Fruit", "Riped Grape", "Wild Honey"],
    photo: "/beans/brazil.jpg",
    radar: { 
      acidity: 7,    // シトリックな酸味
      sweetness: 9,  // 熟したぶどうとワイルドハニーの甘さ
      body: 6,       // クリーミーなボディ
      aroma: 9,      // トロピカルフルーツの香り
      aftertaste: 8  // 長く甘い余韻
    },
    process: "Anaerobic Natural",
    altitude: "1,100m",
    description: "マンゴー、ブラックベリー、パッションフルーツのトロピカルな果実味。クリーミーなボディと長く甘い余韻。",
    category: "normal",
    roaster: "Mirai Seeds",
    roastLevel: "浅煎り",
    price: "¥700",
    stock: "available",
    farm: "Guariroba",
  },

  // Papelburg - KCCブレンド（深煎り）
  {
    id: "kcc-blend",
    key: "guatemala",
    name: "KCC Blend",
    origin: "Blend",
    elevation: "-",
    variety: ["Blend"],
    flavor: ["Cacao", "Caramel", "Roasted Nuts"],
    tasteNote: ["Cacao", "Caramel", "Roasted Nuts", "Brown Sugar"],
    photo: "/beans/guatemala.jpg",
    radar: { 
      acidity: 4,    // マイルドな酸味
      sweetness: 6,  // カラメルの甘さ
      body: 9,       // フルボディ
      aroma: 7,      // 香ばしいナッツとカカオ
      aftertaste: 7  // ビターで長い余韻
    },
    process: "Blend",
    altitude: "-",
    description: "深煎りの豊かなコクとカカオの香ばしさ。カラメルとローストナッツの調和が生み出す安心の一杯。",
    category: "normal",
    roaster: "Papelburg",
    roastLevel: "深煎り",
    price: "¥700",
    stock: "available",
  },

  // ========== Special（限定ライン）- ¥1,000 ==========
  
  // Glitch - Colombia Milan Culturing NG
  {
    id: "colombia-milan",
    key: "colombia-milan",
    name: "Colombia Milan Culturing NG",
    origin: "Colombia",
    elevation: "-",
    variety: ["-"],
    flavor: ["Unique", "Experimental", "Complex"],
    tasteNote: ["Coming Soon"],
    photo: "/beans/colombia-milan",
    radar: { 
      acidity: 7,
      sweetness: 7,
      body: 6,
      aroma: 8,
      aftertaste: 8
    },
    process: "Culturing NG",
    altitude: "-",
    description: "実験的な発酵プロセスによる特別なロット。唯一無二の風味プロファイル。",
    category: "special",
    roaster: "Glitch",
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

export const getNormalBeans = () => BEANS.filter((b) => b.category === "normal");
export const getSpecialBeans = () => BEANS.filter((b) => b.category === "special");

export default BEANS;