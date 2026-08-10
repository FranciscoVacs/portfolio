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
    // biome-ignore lint/a11y/useSemanticElements: son links, no controles de formulario; un <fieldset> fuera de un <form> confunde más al lector de pantalla
    <div
      role="group"
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
