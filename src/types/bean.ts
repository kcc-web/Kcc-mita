export type Bean = {
  id: string;
  name: string;
  origin: string;
  elevation?: string;
  variety?: string[];
  flavor: string[];
  photo: string;
  radar: { acidity: number; sweetness: number; body: number; aroma: number; aftertaste: number };
  key?: string;
  process?: string;
  tags?: string[];
  description?: string; // カードに表示する説明文
  
  // MenuBean用の追加プロパティ
  category?: "normal" | "special";
  roaster?: string;
  roastLevel?: string;
  price?: string;
  stock?: "available" | "limited" | "soldout";
};

