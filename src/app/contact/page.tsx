// app/contact/page.tsx
import Link from "next/link";
import { Mail, Instagram } from "lucide-react";

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
    <main className="relative min-h-screen bg-gradient-to-b from-white to-zinc-50">
      {/* ヘッダー */}
      <header className="mx-auto max-w-5xl px-4 md:px-6 pt-14 pb-10 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900">
          Contact
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-zinc-600 leading-relaxed">
          三田祭・取材・コラボ・慶應珈琲倶楽部に関するお問い合わせは、
          <span className="font-medium text-zinc-800"> Instagram </span>
          または
          <span className="font-medium text-zinc-800"> メール </span>
          で受け付けています。
        </p>
      </header>

      {/* 連絡カード */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 grid gap-6 sm:grid-cols-2">
        {/* Instagram */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <Instagram className="h-6 w-6 text-zinc-800" />
            <h2 className="text-lg md:text-xl font-semibold text-zinc-900">
              Instagram
            </h2>
          </div>
          <p className="mt-2 text-sm text-zinc-600">
            アカウント：<span className="font-mono text-zinc-800">@keiocoffeeclub</span>
          </p>
          <div className="mt-4">
            <Link
              href={IG_URL}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition"
            >
              Instagramで開く
            </Link>
          </div>
        </div>

        {/* Email */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-zinc-800" />
            <h2 className="text-lg md:text-xl font-semibold text-zinc-900">
              Email
            </h2>
          </div>
          <p className="mt-2 text-sm text-zinc-600">
            アドレス：<span className="font-mono text-zinc-800">{MAIL}</span>
          </p>
          <div className="mt-4">
            <Link
              href={mailto()}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition"
            >
              メールを作成する
            </Link>
          </div>
        </div>
      </section>

      {/* 受付内容 */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 mt-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold text-zinc-900">
            受付内容
          </h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-zinc-600 space-y-1.5">
            <li>三田祭に関するご質問</li>
            <li>慶應珈琲倶楽部の活動に関するご質問</li>
            <li>取材・メディア掲載のご相談</li>
            <li>コラボレーションや案件のご相談</li>
          </ul>
        </div>
      </section>

      {/* メールテンプレ */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 mt-12 mb-16">
        <h3 className="text-base md:text-lg font-semibold text-zinc-900">
          メールテンプレ（コピペ用）
        </h3>
        <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800">
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
        <p className="mt-2 text-xs text-zinc-500">
          ※「メールを作成する」ボタンから起動すると、上記テンプレートが自動挿入されます。
        </p>
      </section>
    </main>
  );
}




