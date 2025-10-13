// /app/contact/page.tsx
import Link from "next/link";
import KccCard from "@/components/kcc/KccCard";
import { KccGrid } from "@/components/kcc/KccGrid";
import { KccTag } from "@/components/kcc/KccTag";

export const metadata = { title: "Contact" };

const socials = [
  { name: "X (Twitter)", href: "https://x.com/...", img: "/images/contact/x.jpg" },
  { name: "Instagram",  href: "https://instagram.com/...", img: "/images/contact/ig.jpg" },
];

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="text-muted-foreground mt-2">
        連絡先・SNS・お問い合わせはこちらから。
      </p>

      {/* SNSカード */}
      <section className="mt-8">
        <KccGrid>
          {socials.map((s) => (
            <KccCard
              key={s.name}
              href={s.href}
              title={s.name}
              description="最新情報を配信中"
              image={{ src: s.img, alt: s.name, ratio: "16/9" }}
              footer={<KccTag>外部リンク</KccTag>}
            />
          ))}
        </KccGrid>
      </section>

      {/* 代表連絡（メール or 簡易フォーム） */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">代表連絡</h2>
        <div className="rounded-2xl border border-border p-4 md:p-6">
          <p className="text-sm text-muted-foreground">
            ご質問・コラボのご相談などお気軽にどうぞ。
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="mailto:example@kcc.jp"
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm hover:bg-secondary"
            >
              メールで問い合わせる
            </Link>
            <Link
              href="https://forms.gle/..." // 既存のGoogleフォームURLに差し替え
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm hover:bg-secondary"
            >
              フォームから送る
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
