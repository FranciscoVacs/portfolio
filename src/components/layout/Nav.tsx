import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { LocaleSwitch } from "./LocaleSwitch";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const t = useTranslations("Nav");

  const links = [
    { href: "/", label: t("home") },
    { href: "/work", label: t("work") },
    { href: "/fav", label: t("fav") },
    { href: "/cv", label: t("cv") },
  ] as const;

  return (
    <header className="border-border border-b">
      <Container>
        <nav className="flex items-center justify-between gap-4 py-4">
          <ul className="flex items-center gap-5 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            {/* LocaleSwitch lee searchParams: sin este Suspense el build
                vuelve dinámicas todas las páginas estáticas. */}
            <Suspense fallback={<div className="h-5 w-[3.25rem]" />}>
              <LocaleSwitch />
            </Suspense>
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  );
}
