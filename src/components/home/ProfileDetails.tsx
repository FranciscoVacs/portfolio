import { useLocale } from "next-intl";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/content/schema";
import type { CvContent } from "@/lib/cv-bridge";
import { formatPeriod } from "@/lib/format";

export function ProfileDetails({ content }: { content: CvContent }) {
  const locale = useLocale() as Locale,
    es = locale === "es";
  return (
    <>
      {content.courses.length > 0 ? (
        <Section
          title={es ? "Cursos y certificaciones" : "Courses and certifications"}
        >
          <ul className="flex flex-col gap-7">
            {content.courses.map((c) => (
              <li key={c.id}>
                <h3 className="text-base text-primary">{c.organization}</h3>
                <p className="mt-1 text-sm text-foreground">{c.role}</p>
                <p className="mt-1 font-mono text-xs text-soft">
                  {formatPeriod(
                    { start: c.start, end: c.end || undefined },
                    es ? "Actualidad" : "Present",
                    locale,
                  )}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground">
                  {c.description}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      {content.languages.length > 0 ? (
        <Section title={es ? "Idiomas" : "Languages"}>
          <ul className="flex flex-col gap-2 text-sm text-foreground">
            {content.languages.map((l) => (
              <li key={l.name}>
                <span className="text-primary">{l.name}</span> · {l.level}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
