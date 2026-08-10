import { getLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";
import { fetchContributions, monthLabels, toWeeks } from "@/lib/github";

/**
 * Escala clara derivada del azul de marca del sitio, en lugar del verde de
 * GitHub: el calendario tiene que leerse como parte de la página.
 */
const LEVEL_COLORS = [
  "var(--muted)",
  "color-mix(in oklab, var(--brand) 22%, #fff)",
  "color-mix(in oklab, var(--brand) 45%, #fff)",
  "color-mix(in oklab, var(--brand) 70%, #fff)",
  "var(--brand)",
];

function usernameFrom(githubUrl: string): string | null {
  const [, username] = new URL(githubUrl).pathname.split("/");
  return username || null;
}

export async function GithubActivity() {
  const username = usernameFrom(profile.github);
  if (!username) return null;

  const calendar = await fetchContributions(username);
  if (!calendar) return null;

  const locale = await getLocale();
  const t = await getTranslations("Home");
  const weeks = toWeeks(calendar.days);
  const months = monthLabels(weeks);
  const monthName = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  });
  const dayLabel = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  });

  return (
    <Section title={t("githubActivity")}>
      <p className="-mt-2 mb-4 text-foreground text-sm">
        {t("contributions", { count: calendar.total })}
      </p>

      {/* El calendario necesita ancho para no volverse ilegible: en pantallas
          angostas se desplaza en horizontal en vez de comprimirse. */}
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[520px]">
          <div
            className="grid gap-[3px]"
            style={{
              gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
            }}
          >
            {/* Rótulos de mes: cada uno arranca en la columna de su primera
                semana y se estira hasta donde empieza el siguiente. */}
            {months.map((label, index) => (
              <span
                key={label.column}
                className="mb-1 text-[10px] text-foreground leading-none"
                style={{
                  gridColumn: `${label.column + 1} / ${
                    months[index + 1]?.column + 1 || weeks.length + 1
                  }`,
                }}
              >
                {monthName.format(new Date(Date.UTC(2024, label.month, 1)))}
              </span>
            ))}
          </div>

          {/* Un solo rol de imagen con el total: sin esto un lector de
              pantalla anunciaría 366 celdas sueltas. */}
          <div
            role="img"
            aria-label={t("contributions", { count: calendar.total })}
            className="grid grid-flow-col grid-rows-7 gap-[3px]"
          >
            {weeks
              .flat()
              .map((day) =>
                day.filler ? (
                  <span key={day.date} className="aspect-square w-full" />
                ) : (
                  <span
                    key={day.date}
                    title={`${t("contributionsOn", { count: day.count })} — ${dayLabel.format(new Date(`${day.date}T00:00:00Z`))}`}
                    className="aspect-square w-full rounded-[2px] ring-1 ring-black/[0.04] ring-inset"
                    style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                  />
                ),
              )}
          </div>
        </div>
      </div>

      {/* Fuera del contenedor que se desplaza: la referencia de la escala
          tiene que verse aunque el calendario esté corrido. */}
      <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-foreground">
        <span>{t("less")}</span>
        {LEVEL_COLORS.map((color) => (
          <span
            key={color}
            className="size-[10px] rounded-[2px] ring-1 ring-black/[0.04] ring-inset"
            style={{ backgroundColor: color }}
          />
        ))}
        <span>{t("more")}</span>
      </div>
    </Section>
  );
}
