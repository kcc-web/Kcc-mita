import { Bean } from "@/types/bean";

export const BEANS: Bean[] = [
  {
    id: "ethiopia-washed",
    name: "エチオピア（W）",
    origin: "Ethiopia / Sidama",
    elevation: "1,900–2,100m",
    variety: ["Heirloom"],
    flavor: ["ベルガモット","シトラス","フローラル"],
    photo: "/beans/ethiopia.jpg",
    radar: { acidity: 8, sweetness: 7, body: 4, aroma: 9, aftertaste: 6 },
  },
  {
    id: "colombia",
    name: "コロンビア",
    origin: "Colombia / Huila",
    elevation: "1,600–1,900m",
    variety: ["Caturra","Castillo"],
    flavor: ["キャラメル","チョコ","ナッツ"],
    photo: "/beans/colombia.jpg",
    radar: { acidity: 5, sweetness: 8, body: 6, aroma: 7, aftertaste: 7 },
  },
  {
    id: "kenya",
    name: "ケニア",
    origin: "Kenya / Nyeri",
    elevation: "1,700–2,000m",
    variety: ["SL28","SL34"],
    flavor: ["ブラックカラント","グレープフルーツ","明るい酸"],
    photo: "/beans/kenya.jpg",
    radar: { acidity: 9, sweetness: 6, body: 5, aroma: 9, aftertaste: 7 },
  },
  {
    id: "guatemala",
    name: "グアテマラ",
    origin: "Guatemala / Antigua",
    elevation: "1,500–1,700m",
    variety: ["Bourbon","Caturra"],
    flavor: ["カカオ","スパイス","バランス"],
    photo: "/beans/guatemala.jpg",
    radar: { acidity: 6, sweetness: 6, body: 7, aroma: 7, aftertaste: 6 },
  },
];

export const WAFFLE = {
  id: "waffle",
  name: "ベルギーワッフル",
  flavor: ["バター","はちみつ","香ばしさ"],
  photo: "/beans/waffle.jpg",
};

