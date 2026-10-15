"use client";

import { useLocale } from "next-intl";
import { DottedLink } from "@/components/ui/DottedLink";
import type { Locale } from "@/content/schema";
import { usePathname } from "@/i18n/navigation";
import { portfolioBundle, resolveCv } from "@/lib/cv-bridge";
import { Container } from "./Container";

export function Footer() {
  const id = usePathname().match(/^\/perfil\/([^/]+)/)?.[1];
  const { profile } = portfolioBundle(
    resolveCv(useLocale() as Locale, id).content,
  );
  return (
    <footer className="mt-20 border-border border-t py-8">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 text-foreground text-sm">
          <span className="font-mono text-xs">
            © {new Date().getFullYear()} {profile.name}
          </span>
          <div className="flex gap-4">
            {profile.github ? (
              <DottedLink href={profile.github} external>
                GitHub
              </DottedLink>
            ) : null}
            {profile.linkedin ? (
              <DottedLink href={profile.linkedin} external>
                LinkedIn
              </DottedLink>
            ) : null}
            <DottedLink href={`mailto:${profile.email}`}>Email</DottedLink>
          </div>
        </div>
      </Container>
    </footer>
  );
}
