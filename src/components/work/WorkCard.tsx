import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { DottedLink } from "@/components/ui/DottedLink";
import { HoverCard } from "@/components/ui/HoverCard";
import { TechBadge } from "@/components/ui/TechBadge";
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
    <HoverCard>
      <article>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[1.3rem] text-primary leading-tight">
            {project.title}
          </h2>
          <span className="font-mono text-foreground text-xs tracking-tight">
            {formatPeriod(project.period, tHome("present"), locale)}
          </span>
        </div>

        {/* La miniatura acompaña a la descripción en vez de encabezar la
            tarjeta: en pantallas angostas vuelve a apilarse arriba. */}
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
          {project.image ? (
            <Image
              src={project.image.src}
              alt={project.image.alt[locale]}
              width={project.image.width}
              height={project.image.height}
              sizes="(min-width: 40rem) 200px, 100vw"
              className="h-auto w-full rounded-md border border-border sm:w-[200px] sm:shrink-0"
            />
          ) : null}

          <div className="min-w-0 flex-1">
            <p className="text-foreground leading-relaxed">
              {project.summary[locale]}
            </p>

            <p className="mt-3 text-foreground text-sm leading-relaxed">
              {project.story[locale]}
            </p>
          </div>
        </div>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li key={tech}>
              <TechBadge name={tech} />
            </li>
          ))}
        </ul>

        {links.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-4 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <DottedLink href={link.href} external>
                  {link.label}
                </DottedLink>
              </li>
            ))}
          </ul>
        ) : null}
      </article>
    </HoverCard>
  );
}
