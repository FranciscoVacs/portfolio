import { useLocale, useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/schema";

export function About() {
  const t = useTranslations("Home");
  const locale = useLocale() as Locale;

  return (
    <Section title={t("about")}>
      <p className="text-foreground leading-relaxed">{profile.bio[locale]}</p>
    </Section>
  );
}
