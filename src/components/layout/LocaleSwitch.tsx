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
      className="inline-flex items-center rounded-full border border-border bg-muted p-0.5"
    >
      {routing.locales.map((locale) => {
        const current = locale === active;
        return (
          <Link
            key={locale}
            href={{ pathname, query }}
            locale={locale}
            hrefLang={locale}
            aria-current={current ? "true" : undefined}
            className={`rounded-full px-2.5 py-1 font-medium text-xs transition-all duration-200 ${
              current
                ? "bg-background text-primary shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
                : "text-foreground hover:text-primary"
            }`}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
