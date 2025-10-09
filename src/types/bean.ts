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
};

