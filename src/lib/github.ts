import { z } from "zod";

/**
 * El calendario de contribuciones no está en la API REST pública de GitHub:
 * la oficial es GraphQL y exige un token. Este proxy público lo expone sin
 * credenciales, así que el sitio no necesita secretos para desplegarse.
 *
 * Es un servicio de terceros: si cambia o se cae, fetchContributions devuelve
 * null y la sección desaparece en vez de romper la página.
 */
const ENDPOINT = "https://github-contributions-api.jogruber.de/v4";

/** Medio día: el calendario cambia poco y esto evita pegarle en cada visita. */
const REVALIDATE_SECONDS = 60 * 60 * 12;

const responseSchema = z.object({
  contributions: z
    .array(
      z.object({
        date: z.iso.date(),
        count: z.int().nonnegative(),
        /** Intensidad ya calculada por la API, de 0 (nada) a 4 (máximo). */
        level: z.int().min(0).max(4),
      }),
    )
    .min(1),
});

export type ContributionDay = z.infer<
  typeof responseSchema
>["contributions"][number];

export type ContributionCalendar = {
  days: ContributionDay[];
  total: number;
};

/**
 * Devuelve el último año de contribuciones, o null ante cualquier problema
 * (red, formato inesperado, servicio caído). Nunca lanza: la home tiene que
 * renderizar igual sin este dato.
 */
export async function fetchContributions(
  username: string,
): Promise<ContributionCalendar | null> {
  try {
    const response = await fetch(
      `${ENDPOINT}/${encodeURIComponent(username)}?y=last`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    if (!response.ok) return null;

    const parsed = responseSchema.safeParse(await response.json());
    if (!parsed.success) return null;

    const days = parsed.data.contributions;
    return {
      days,
      // Se suma en vez de leer el `total` de la respuesta para que el número
      // que se muestra coincida siempre con los cuadrados que se dibujan.
      total: days.reduce((sum, day) => sum + day.count, 0),
    };
  } catch {
    return null;
  }
}

/**
 * Celda del calendario. Las de relleno completan la primera y la última
 * semana, que casi nunca empiezan un domingo ni terminan un sábado; llevan
 * fecha propia para tener una clave estable y se dibujan vacías.
 */
export type CalendarCell = ContributionDay & { filler: boolean };

function shiftDate(date: string, days: number): string {
  const shifted = new Date(`${date}T00:00:00Z`);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
}

const filler = (date: string): CalendarCell => ({
  date,
  count: 0,
  level: 0,
  filler: true,
});

/**
 * Reparte los días en columnas semanales de domingo a sábado.
 */
export function toWeeks(days: ContributionDay[]): CalendarCell[][] {
  const first = days[0];
  const last = days[days.length - 1];
  const before = new Date(`${first.date}T00:00:00Z`).getUTCDay();
  const after = 6 - new Date(`${last.date}T00:00:00Z`).getUTCDay();

  const cells: CalendarCell[] = [
    ...Array.from({ length: before }, (_, i) =>
      filler(shiftDate(first.date, i - before)),
    ),
    ...days.map((day) => ({ ...day, filler: false })),
    ...Array.from({ length: after }, (_, i) =>
      filler(shiftDate(last.date, i + 1)),
    ),
  ];

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

/**
 * Columna en la que empieza cada mes, para rotular el eje. Saltea la primera
 * columna, donde la etiqueta no tendría ancho para entrar.
 */
export function monthLabels(
  weeks: CalendarCell[][],
): { month: number; column: number }[] {
  const labels: { month: number; column: number }[] = [];
  let previous = -1;

  weeks.forEach((week, column) => {
    const first = week.find((day) => !day.filler);
    if (!first) return;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (month !== previous) {
      previous = month;
      if (column > 0) labels.push({ month, column });
    }
  });

  return labels;
}
