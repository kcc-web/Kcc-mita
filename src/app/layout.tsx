// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Menu as MenuIcon } from "lucide-react";
import ActiveLink from "@/components/ui/ActiveLink" ;


export const metadata: Metadata = {
  title: "KCC Mita 2025",
  description: "Keio Coffee Club — Mita Festival 2025",
  metadataBase: new URL("https://example.com"), // ←本番URLに差し替え
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

function NavLinks() {
  const items = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About us" },
    { href: "/menu", label: "Menu" },
    { href: "/quiz", label: "MBTI 診断" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <nav className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-sm">
      {items.map((it) => (
       <ActiveLink key={it.href} href={it.href} className="active-underline">
       {it.label}
      </ActiveLink>

      ))}
    </nav>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
            <Link
              href="/"
              aria-label="KCC Mita"
              className="text-base md:text-lg font-semibold tracking-tight"
            >
              KCC
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:block">
              <NavLinks />
            </div>

            {/* ✅ Mobile hamburger (Lucide icon version) */}
            <details className="md:hidden relative">
              <summary
                className="list-none inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border cursor-pointer text-foreground p-0"
                aria-label="Open menu"
              >
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-5 w-5" aria-hidden="true" />
              </summary>

              <div className="absolute right-0 mt-2 min-w-[220px] rounded-xl border border-border bg-background shadow">
                <div className="px-4 py-3">
                  <NavLinks />
                </div>
              </div>
            </details>
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
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-80"
                >
                  Instagram
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-80"
                >
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
