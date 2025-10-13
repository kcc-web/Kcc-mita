"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ActiveLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "px-1.5 py-1 rounded-md transition-colors",
        active ? "bg-secondary text-foreground" : "hover:text-foreground/80",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
