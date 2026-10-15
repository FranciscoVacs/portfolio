import { useLocale, useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { profile as originalProfile } from "@/content/profile";
import type { Locale, Profile } from "@/content/schema";

export function About({ profile = originalProfile }: { profile?: Profile }) {
  const t = useTranslations("Home");
  const locale = useLocale() as Locale;

  return (
    <Section title={t("about")}>
      <p className="text-foreground leading-relaxed">{profile.bio[locale]}</p>
    </Section>
  );
}
