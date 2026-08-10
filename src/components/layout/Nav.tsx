import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { LocaleSwitch } from "./LocaleSwitch";
import { NavLink } from "./NavLink";

export function Nav() {
  const t = useTranslations("Nav");

  const links = [
    { href: "/", label: t("home") },
    { href: "/work", label: t("work") },
    { href: "/fav", label: t("fav") },
    { href: "/cv", label: t("cv") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <nav>
          <ul className="flex items-center gap-1 rounded-full border border-border/60 bg-secondary/80 px-2 py-1.5 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          {/* LocaleSwitch lee searchParams: sin este Suspense el build
              vuelve dinámicas todas las páginas estáticas. */}
          <Suspense fallback={<div className="h-5 w-[3.25rem]" />}>
            <LocaleSwitch />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
