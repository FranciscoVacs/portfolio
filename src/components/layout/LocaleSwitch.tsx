"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = useLocale();
  const t = useTranslations("Nav");

  // usePathname de next-intl no incluye el query string: sin esto,
  // cambiar de idioma desde /work?type=contract pierde el filtro.
  const query = Object.fromEntries(searchParams.entries());

  return (
    <nav
      aria-label={t("switchLanguage")}
      className="flex items-center gap-1 text-sm"
    >
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={{ pathname, query }}
          locale={locale}
          className={
            locale === active
              ? "font-medium text-primary"
              : "text-foreground transition-colors hover:text-primary"
          }
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
