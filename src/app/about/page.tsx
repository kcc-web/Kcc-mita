// app/about/page.tsx
import AboutClient from "./AboutClient";

export const metadata = {
  title: "About Us | KCC Mita",
  description: "慶應珈琲倶楽部（KCC）のミッション、活動内容、メンバー紹介など。",
};

const activities = [
  {
    id: 1,
    title: "ドリップ会",
    description:
      "豆の飲み比べや、各自が持ち寄った豆でコーヒーを楽しむ定期イベント",
    image: "/images/activities/drip-session.jpg",
    icon: "coffee",
    tags: ["週1回", "日吉キャンパス"],
  },
  {
    id: 2,
    title: "カフェ巡り",
    description: "都内の有名コーヒーショップを巡り、プロのテクニックを学ぶ",
    image: "/images/activities/cafe-tour.jpg",
    icon: "mapPin",
    tags: ["月1回", "都内各地"],
  },
  {
    id: 3,
    title: "三田祭出店",
    description: "年間最大イベント。特製ブレンドと焼き菓子でおもてなし",
    image: "/images/activities/mita-festival.jpg",
    icon: "star",
    tags: ["11月", "三田キャンパス"],
  },
  {
    id: 4,
    title: "POP UP カフェ",
    description: "学内外でのイベント出店。コーヒー文化を広める活動",
    image: "/images/activities/popup.jpg",
    icon: "calendar",
    tags: ["不定期", "各種イベント"],
  },
  {
    id: 5,
    title: "他大学交流",
    description: "全国の大学コーヒーサークルとの交流会や合同イベント",
    image: "/images/activities/exchange.jpg",
    icon: "users",
    tags: ["年3回", "関東圏"],
  },
  {
    id: 6,
    title: "プロセミナー",
    description: "珈琲店のプロから直接学ぶ焙煎・抽出技術のワークショップ",
    image: "/images/activities/seminar.jpg",
    icon: "sparkles",
    tags: ["隔月", "特別講座"],
  },
];

export default function AboutPage() {
  return <AboutClient activities={activities} />;
}
