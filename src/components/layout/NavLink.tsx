"use client";

import { DottedUnderline } from "@/components/ui/DottedLink";
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
          ? "group font-mono text-primary text-xs uppercase tracking-wide transition-colors hover:text-brand"
          : "group font-mono text-foreground text-xs uppercase tracking-wide transition-colors hover:text-brand"
      }
    >
      <span className="relative inline-block">
        {label}
        <DottedUnderline onlyOnHover forceVisible={active} />
      </span>
    </Link>
  );
}
