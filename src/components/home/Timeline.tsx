import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { DottedUnderline } from "@/components/ui/DottedLink";
import { Section } from "@/components/ui/Section";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import type { EducationItem, Locale } from "@/content/schema";
import { formatPeriod } from "@/lib/format";

/**
 * Encabezado de una institución: logo y nombre dentro de un mismo enlace, para
 * que sea un solo destino de teclado en vez de dos que van al mismo lado.
 *
 * El logo va en una caja de medidas fijas con object-contain: los tres tienen
 * proporciones muy distintas (5:1, 4:1 y 2:1) y sin encuadrarlos el más
 * apaisado se vería del doble de ancho que el resto.
 */
function InstitutionName({ item }: { item: EducationItem }) {
  const content = (
    <>
      {item.logo ? (
        // Ficha cuadrada comun: los isotipos van de 0.85:1 a 2:1 y uno trae
        // fondo negro solido. Encuadrarlos en una caja clara los deja del
        // mismo peso visual y contiene el bloque oscuro.
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-paper p-1.5">
          <Image
            src={item.logo.src}
            alt=""
            width={item.logo.width}
            height={item.logo.height}
            className="max-h-8 max-w-8 object-contain"
          />
        </span>
      ) : null}
      <span className="relative">
        {item.institution}
        {item.url ? <DottedUnderline /> : null}
      </span>
    </>
  );

  return (
    <h3 className="text-primary text-base">
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 transition-colors hover:text-brand"
        >
          {content}
        </a>
      ) : (
        <span className="inline-flex items-center gap-3">{content}</span>
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
            <li key={`${item.institution}-${item.period.start}`}>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <InstitutionName item={item} />
                <span className="font-mono text-foreground text-xs tracking-tight">
                  {formatPeriod(item.period, present, locale)}
                </span>
              </div>
              {/* Alineado con el texto del encabezado, no con la ficha. */}
              <p className="mt-1 pl-14 font-mono text-soft text-xs">
                {item.degree[locale]}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
