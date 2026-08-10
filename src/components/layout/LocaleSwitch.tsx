"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitch() {
  const pathname = usePathname();
  const active = useLocale();

  return (
    <div className="flex items-center gap-1 text-sm">
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          className={
            locale === active
              ? "font-medium text-foreground"
              : "text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
