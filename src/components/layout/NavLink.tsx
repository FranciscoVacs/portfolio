"use client";

import { Link, usePathname } from "@/i18n/navigation";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "inline-block rounded-full bg-secondary px-3 py-1.5 text-foreground"
          : "inline-block rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
      }
    >
      {label}
    </Link>
  );
}
