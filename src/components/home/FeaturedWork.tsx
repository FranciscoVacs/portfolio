import { useLocale, useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { projects } from "@/content/projects";
import type { Locale } from "@/content/schema";
import { Link } from "@/i18n/navigation";
import { formatPeriod } from "@/lib/format";
import { featuredProjects } from "@/lib/projects";

export function FeaturedWork() {
  const t = useTranslations("Home");
  const locale = useLocale() as Locale;
  const featured = featuredProjects(projects);

  return (
    <Section title={t("featuredWork")}>
      <ul className="flex flex-col gap-6">
        {featured.map((project) => (
          <li key={project.slug}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium text-foreground">{project.title}</h3>
              <span className="text-muted-foreground text-sm">
                {formatPeriod(project.period, t("present"), locale)}
              </span>
            </div>
            <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
              {project.summary[locale]}
            </p>
          </li>
        ))}
      </ul>
      <Link
        href="/work"
        className="mt-6 inline-block text-foreground text-sm underline underline-offset-4"
      >
        {t("seeAllWork")}
      </Link>
    </Section>
  );
}
