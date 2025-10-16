"use client";

import ActiveLink from "@/components/ui/ActiveLink";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();
  const hideMenu = pathname?.startsWith("/quiz");

  const items = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About us" },
    !hideMenu ? { href: "/menu", label: "Menu" } : null,
    { href: "/quiz/intro", label: "MBTI 診断" },
    { href: "/contact", label: "Contact" },
  ].filter(Boolean) as { href: string; label: string }[];

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
