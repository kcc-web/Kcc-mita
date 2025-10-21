// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Menu as MenuIcon } from "lucide-react";
import NavLinks from "@/components/ui/NavLinks";
import VenueStatusBadge from "@/components/ui/VenueStatusBadge";

export const metadata: Metadata = {
  title: "KCC Mita 2025",
  description: "Keio Coffee Club — Mita Festival 2025",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "KCC Mita 2025",
    description: "Keio Coffee Club — Mita Festival 2025",
    url: "https://example.com",
    siteName: "KCC Mita",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KCC Mita 2025",
    description: "Keio Coffee Club — Mita Festival 2025",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-background text-foreground">
        {/* 背景 */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-pink-300 via-orange-200 to-yellow-200" />
          <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full blur-3xl opacity-15 bg-gradient-to-tr from-violet-200 via-fuchsia-200 to-rose-200" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-md shadow-[0_1px_10px_rgba(0,0,0,0.03)]">
          <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 h-14 flex items-center gap-3">
            {/* 左：ロゴ */}
            <Link
              href="/"
              aria-label="KCC Mita"
              className="text-base md:text-lg font-semibold tracking-tight flex-shrink-0"
            >
              KCC
            </Link>

            {/* 中：インラインの会場バッジ（ロゴとナビの間） */}
            <VenueStatusBadge
              variant="inline"
              className="flex-1 min-w-0 hidden sm:block" // モバイル極小幅では非表示→下にミニ版を出すならここを調整
            />

            {/* 右：デスクトップナビ */}
            <div className="hidden md:block">
              <NavLinks />
            </div>

            {/* 右端：モバイルメニュー */}
            <details className="md:hidden relative">
              <summary
                className="list-none inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border cursor-pointer p-0"
                aria-label="Open menu"
              >
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-5 w-5" aria-hidden="true" />
              </summary>

              <div className="absolute right-0 mt-2 min-w-[220px] rounded-xl border border-border bg-background shadow-md">
                <div className="px-4 py-3">
                  <NavLinks />
                </div>
              </div>
            </details>
          </div>

          {/* モバイル：幅が足りない時だけ下段に小さく表示 */}
          <div className="sm:hidden px-4 pb-2">
            <VenueStatusBadge variant="inline" className="w-full" />
          </div>
        </header>

        {/* Main */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t mt-12">
          <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-10 text-sm text-muted-foreground">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p>© {new Date().getFullYear()} Keio Coffee Club</p>
              <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="hover:opacity-80">
                  Instagram
                </a>
                <a href="https://x.com/" target="_blank" rel="noreferrer" className="hover:opacity-80">
                  X
                </a>
                <Link href="/access" className="hover:opacity-80">
                  Access
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}


