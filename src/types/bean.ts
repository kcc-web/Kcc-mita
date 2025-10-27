export type Bean = {
  id: string;
  name: string;
  origin: string;
  elevation?: string;
  variety?: string[];
  flavor: string[];
  photo: string;
  radar: { 
    acidity: number; 
    sweetness: number; 
    body: number; 
    aroma: number; 
    aftertaste: number 
  };
  key?: string;
  process?: string;
  tags?: string[];
  description?: string;
  
  // MenuBean用の追加プロパティ
  category?: "normal" | "special";
  roaster?: string;
  roastLevel?: string;
  price?: string;
  stock?: "available" | "limited" | "soldout";
  
  // 詳細情報
  altitude?: string;
  producer?: string;
  farm?: string;
  region?: string;
  tasteNote?: string[];
};

