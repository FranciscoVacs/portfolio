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

        {/* La miniatura flota y el texto la envuelve: con dos columnas
            quedaba un hueco debajo de la imagen cada vez que la descripción
            era más alta que ella. La proporción es fija para que todas las
            tarjetas muestren la misma caja, sin importar el alto original. */}
        <div className="mt-3">
          {project.image ? (
            <Image
              src={project.image.src}
              alt={project.image.alt[locale]}
              width={project.image.width}
              height={project.image.height}
              sizes="(min-width: 40rem) 190px, 100vw"
              className="mb-4 aspect-[4/3] w-full rounded-md border border-border object-cover sm:float-left sm:mr-5 sm:mb-2 sm:w-[190px]"
            />
          ) : null}

          <p className="text-foreground leading-relaxed">
            {project.summary[locale]}
          </p>

          <p className="mt-3 text-foreground text-sm leading-relaxed">
            {project.story[locale]}
          </p>

          {/* Corta el float para que el stack no se meta al costado de la
              miniatura cuando el texto es corto. */}
          <div className="clear-both" />
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
