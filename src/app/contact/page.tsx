// app/contact/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Contact | KCC Mita",
  description:
    "三田祭・取材・コラボ・慶應珈琲倶楽部に関するお問い合わせは、Instagramまたはメールで受け付けています。",
};

const IG_URL = "https://instagram.com/keiocoffeeclub";
const MAIL = "keio.coffeeclub@gmail.com";

const mailto = () =>
  `mailto:${MAIL}?subject=${encodeURIComponent("【お問い合わせ】")}&body=${encodeURIComponent(
    [
      "【お名前／ご所属】",
      "",
      "【ご用件の種類】",
      "（三田祭／取材／コラボ・案件／その他）",
      "",
      "【お問い合わせ内容】",
      "",
      "【ご希望の連絡方法】",
      "（メール／Instagram DM）",
      "",
      "【ご返信が取りやすい時間帯】",
      "",
    ].join("\n")
  )}`;

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 md:px-6 py-10">
      {/* ヘッダー */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Contact</h1>
        <p className="text-muted-foreground mt-2">
          三田祭・取材・コラボ・慶應珈琲倶楽部に関するお問い合わせは、
          <span className="font-medium"> Instagram </span>
          または
          <span className="font-medium"> メール </span>
          で受け付けています。
        </p>
      </header>

      {/* 連絡手段 */}
      <section className="grid gap-4 sm:grid-cols-2">
        {/* Instagram */}
        <div className="rounded-2xl border border-border p-5 hover:shadow-sm transition">
          <h2 className="text-xl font-semibold">Instagram</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            アカウント：<span className="font-mono">@keiocoffeeclub</span>
          </p>
          <div className="mt-4">
            <Link
              href={IG_URL}
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Instagramで開く
            </Link>
          </div>
        </div>

        {/* Email */}
        <div className="rounded-2xl border border-border p-5 hover:shadow-sm transition">
          <h2 className="text-xl font-semibold">Email</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            アドレス：<span className="font-mono">{MAIL}</span>
          </p>
          <div className="mt-4">
            <Link
              href={mailto()}
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              メールを作成する
            </Link>
          </div>
        </div>
      </section>

      {/* 受付内容 */}
      <section className="mt-10">
        <h3 className="text-lg font-semibold mb-2">受付内容</h3>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          <li>三田祭に関するご質問</li>
          <li>慶應珈琲倶楽部の活動に関するご質問</li>
          <li>取材・メディア掲載のご相談</li>
          <li>コラボレーションや案件のご相談</li>
        </ul>
      </section>

      {/* メールテンプレ */}
      <section className="mt-10">
        <h3 className="text-lg font-semibold mb-2">メールテンプレ（コピペ用）</h3>
        <pre className="whitespace-pre-wrap rounded-xl border p-4 text-sm">
{`件名：【お問い合わせ】

本文：
【お名前／ご所属】

【ご用件の種類】
（三田祭／取材／コラボ・案件／その他）

【お問い合わせ内容】

【ご希望の連絡方法】
（メール／Instagram DM）

【ご返信が取りやすい時間帯】`}
        </pre>
        <p className="text-xs text-muted-foreground mt-2">
          ※「メールを作成する」ボタンから開くと、上記テンプレートが自動で挿入されます。
        </p>
      </section>
    </main>
  );
}


