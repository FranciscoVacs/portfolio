import { useLocale, useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import type { Locale } from "@/content/schema";
import { formatPeriod } from "@/lib/format";

export function Timeline() {
  const t = useTranslations("Home");
  const locale = useLocale() as Locale;
  const present = t("present");

  return (
    <>
      <Section title={t("experience")}>
        <ul className="flex flex-col gap-7">
          {experience.map((item) => (
            <li key={`${item.company}-${item.period.start}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-medium text-primary">{item.company}</h3>
                <span className="text-foreground text-sm">
                  {formatPeriod(item.period, present, locale)}
                </span>
              </div>
              <p className="text-foreground text-sm">{item.role[locale]}</p>
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-foreground text-sm">
                {item.highlights[locale].map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t("education")}>
        <ul className="flex flex-col gap-5">
          {education.map((item) => (
            <li key={`${item.institution}-${item.period.start}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-medium text-primary">{item.institution}</h3>
                <span className="text-foreground text-sm">
                  {formatPeriod(item.period, present, locale)}
                </span>
              </div>
              <p className="text-foreground text-sm">{item.degree[locale]}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
