"use client";

import { DottedUnderline } from "@/components/ui/DottedLink";
import { Link, usePathname } from "@/i18n/navigation";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const scope = pathname.match(/^\/perfil\/[^/]+/)?.[0];
  const destination =
    scope && ["/", "/work", "/cv"].includes(href)
      ? scope + (href === "/" ? "" : href)
      : href;
  const active =
    href === "/" ? pathname === destination : pathname.startsWith(destination);

  return (
    <Link
      href={destination}
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
