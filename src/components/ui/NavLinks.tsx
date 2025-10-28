// src/components/ui/NavLinks.tsx
"use client";

import ActiveLink from "@/components/ui/ActiveLink";

export default function NavLinks() {
  // ✅ hideMenuロジックを完全削除（常にMenuを表示）
  const items = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About us" },
    { href: "/menu", label: "Menu" }, // ← 常に表示
    { href: "/quiz/intro", label: "診断" },
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
