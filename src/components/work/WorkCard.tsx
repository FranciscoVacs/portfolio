import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale, Project } from "@/content/schema";
import { formatPeriod } from "@/lib/format";

export function WorkCard({ project }: { project: Project }) {
  const t = useTranslations("Work");
  const tHome = useTranslations("Home");
  const locale = useLocale() as Locale;

  const links = [
    project.links.live
      ? { href: project.links.live, label: t("liveDemo") }
      : null,
    project.links.repo
      ? { href: project.links.repo, label: t("sourceCode") }
      : null,
    project.links.store
      ? { href: project.links.store, label: t("store") }
      : null,
  ].filter((link) => link !== null);

  return (
    <article className="border-border border-t pt-8">
      {project.image ? (
        <Image
          src={project.image.src}
          alt={project.image.alt[locale]}
          width={1200}
          height={675}
          className="mb-5 aspect-video w-full rounded-lg border border-border object-cover"
        />
      ) : null}

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-medium text-foreground">{project.title}</h2>
        <span className="text-muted-foreground text-sm">
          {formatPeriod(project.period, tHome("present"), locale)}
        </span>
      </div>

      <p className="mt-2 text-muted-foreground leading-relaxed">
        {project.summary[locale]}
      </p>

      <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-muted-foreground text-sm">
        {project.highlights[locale].map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>

      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-border px-2.5 py-0.5 text-muted-foreground text-xs"
          >
            {tech}
          </li>
        ))}
      </ul>

      {links.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
