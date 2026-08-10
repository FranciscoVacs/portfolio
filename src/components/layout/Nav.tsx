import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
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
    <header className="relative pt-0.5">
      <div className="mx-auto max-w-2xl px-4">
        <nav className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="font-medium font-mono text-sm tracking-wide"
          >
            FV
          </Link>
          <div className="flex items-center gap-5">
            {links.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
            {/* LocaleSwitch lee searchParams: sin este Suspense el build
                vuelve dinámicas todas las páginas estáticas. */}
            <Suspense fallback={<div className="h-5 w-[3.25rem]" />}>
              <LocaleSwitch />
            </Suspense>
          </div>
        </nav>
      </div>
    </header>
  );
}
