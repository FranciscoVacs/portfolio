import { useLocale, useTranslations } from "next-intl";
import { DottedLocaleLink } from "@/components/ui/DottedLink";
import { Section } from "@/components/ui/Section";
import { projects } from "@/content/projects";
import type { Locale } from "@/content/schema";
import { formatPeriod } from "@/lib/format";
import { featuredProjects } from "@/lib/projects";

export function FeaturedWork() {
  const t = useTranslations("Home");
  const locale = useLocale() as Locale;
  const featured = featuredProjects(projects);

  return (
    <Section title={t("featuredWork")}>
      <ul className="flex flex-col gap-7">
        {featured.map((project) => (
          <li key={project.slug}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[1.2rem] text-primary leading-tight">
                {project.title}
              </h3>
              <span className="font-mono text-foreground text-xs tracking-tight">
                {formatPeriod(project.period, t("present"), locale)}
              </span>
            </div>
            <p className="mt-1 text-foreground text-sm leading-relaxed">
              {project.summary[locale]}
            </p>
          </li>
        ))}
      </ul>
      <DottedLocaleLink href="/work" className="mt-6 inline-block text-sm">
        {t("seeAllWork")}
      </DottedLocaleLink>
    </Section>
  );
}
