// /app/about/page.tsx
import KccCard from "@/components/kcc/KccCard";
import { KccGrid } from "@/components/kcc/KccGrid";

export const metadata = { title: "About us" };

const missions = [
  {
    title: "私たちの理念",
    desc: "コーヒーを通じて、人がつながる“場”をつくる。",
    img: "/images/about/mission.jpg",
  },
  {
    title: "活動内容",
    desc: "三田祭・交流会・ワークショップ・焙煎体験などを企画運営。",
    img: "/images/about/activity.jpg",
  },
  {
    title: "組織と体制",
    desc: "KCC（慶應珈琲倶楽部）を中心に学内外と協働。",
    img: "/images/about/team.jpg",
  },
];

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight">About us</h1>
      <p className="text-muted-foreground mt-2">
        慶應珈琲倶楽部（KCC）は、コーヒーがもつ「人を近づける力」を信じています。
      </p>

      <div className="mt-8">
        <KccGrid>
          {missions.map((m) => (
            <KccCard
              key={m.title}
              title={m.title}
              description={m.desc}
              image={{ src: m.img, alt: m.title, ratio: "16/9" }}
            />
          ))}
        </KccGrid>
      </div>
    </main>
  );
}
