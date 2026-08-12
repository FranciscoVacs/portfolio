import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { DottedUnderline } from "@/components/ui/DottedLink";
import { Section } from "@/components/ui/Section";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import type { EducationItem, Locale } from "@/content/schema";
import { formatPeriod } from "@/lib/format";

/**
 * Ficha del logo institucional.
 *
 * Los isotipos van de 0.85:1 a 2:1 y el de la EPCTV trae fondo negro sólido,
 * así que se encuadran en una caja cuadrada clara: los deja del mismo peso
 * visual y contiene el bloque oscuro.
 *
 * Cuando hay enlace, la ficha también lleva al sitio, pero sale del orden de
 * tabulación y del árbol de accesibilidad: el nombre de al lado ya ofrece ese
 * mismo destino y repetirlo obliga a pasar dos veces por lo mismo.
 */
function InstitutionLogo({ item }: { item: EducationItem }) {
  if (!item.logo) return null;

  const badge = (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-paper p-1.5">
      <Image
        src={item.logo.src}
        alt=""
        width={item.logo.width}
        height={item.logo.height}
        className="max-h-8 max-w-8 object-contain"
      />
    </span>
  );

  if (!item.url) return badge;

  return (
    <>
      {/* biome-ignore lint/a11y/useAnchorContent: sin texto a propósito. Duplica el enlace del nombre de al lado, que sí lo anuncia; con aria-hidden y tabIndex -1 queda clicable con el mouse sin obligar a pasar dos veces por el mismo destino. */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="shrink-0"
      >
        {badge}
      </a>
    </>
  );
}

function InstitutionName({ item }: { item: EducationItem }) {
  const name = (
    <span className="relative">
      {item.institution}
      {item.url ? <DottedUnderline /> : null}
    </span>
  );

  return (
    <h3 className="text-base text-primary">
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group transition-colors hover:text-brand"
        >
          {name}
        </a>
      ) : (
        name
      )}
    </h3>
  );
}

export function Timeline() {
  const t = useTranslations("Home");
  const locale = useLocale() as Locale;
  const present = t("present");

  return (
    <>
      <Section title={t("experience")}>
        <ul className="flex flex-col gap-8">
          {experience.map((item) => (
            <li key={`${item.company}-${item.period.start}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-base text-primary">{item.company}</h3>
                <span className="font-mono text-foreground text-xs tracking-tight">
                  {formatPeriod(item.period, present, locale)}
                </span>
              </div>
              <p className="mt-0.5 font-mono text-soft text-xs">
                {item.role[locale]}
              </p>
              <p className="mt-3 text-foreground text-sm leading-relaxed">
                {item.story[locale]}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t("education")}>
        <ul className="flex flex-col gap-7">
          {education.map((item) => (
            // El logo es hermano de todo el bloque de texto, no del título:
            // así queda centrado contra el conjunto de nombre y carrera.
            <li
              key={`${item.institution}-${item.period.start}`}
              className="flex items-center gap-3"
            >
              <InstitutionLogo item={item} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <InstitutionName item={item} />
                  <span className="font-mono text-foreground text-xs tracking-tight">
                    {formatPeriod(item.period, present, locale)}
                  </span>
                </div>
                <p className="mt-1 font-mono text-soft text-xs">
                  {item.degree[locale]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
