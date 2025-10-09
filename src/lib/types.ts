export type FlavorRadar = {
  acidity: number; sweet: number; body: number; bitterness: number; aroma: number;
};

export type Cafe = {
  id: string;
  name: string;
  category: 'coffee'|'waffle';
  price: number;
  status: 'available'|'soldout';
  origin?: string | null;
  elevation_m?: number | null;
  variety?: string | null;
  process?: string | null;
  roast?: string | null;
  flavor_notes?: string[] | null;
  radar?: FlavorRadar | null;
  image_url?: string | null;
  order_index?: number | null;
};

export type QuizQuestion = {
  id: string;
  order_index: number;
  text: string;
  scale_min_label: string | null;
  scale_max_label: string | null;
};

export type QuizWeight = {
  id: string;
  bean_key: string;        // 例: ETH_LIGHT / COL_MED / BRA_MED
  weights: FlavorRadar;    // {"acidity":0.4, ...}
};
