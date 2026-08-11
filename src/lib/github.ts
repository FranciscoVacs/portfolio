import { z } from "zod";

/**
 * El calendario de contribuciones vive solo en la API GraphQL de GitHub, que
 * pide autenticación. Hay dos fuentes, en este orden:
 *
 * 1. GraphQL con GITHUB_CONTRIBUTIONS_TOKEN (scope `read:user`). Es la
 *    oficial y la única que incluye los repositorios privados.
 * 2. Un proxy público, sin credenciales, que solo ve lo público.
 *
 * El respaldo importa: si el token vence o se revoca, el calendario sigue
 * apareciendo con los números públicos en vez de desaparecer. Y sin token
 * configurado —desarrollo local, por ejemplo— el sitio funciona igual.
 */
const PROXY_ENDPOINT = "https://github-contributions-api.jogruber.de/v4";
const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

/** Medio día: el calendario cambia poco y esto evita pegarle en cada visita. */
const REVALIDATE_SECONDS = 60 * 60 * 12;

/** Día del calendario, con la intensidad ya normalizada a 0..4. */
export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

export type ContributionCalendar = {
  days: ContributionDay[];
  total: number;
  /** De dónde salieron los datos; `graphql` incluye repositorios privados. */
  source: "graphql" | "proxy";
};

const proxySchema = z.object({
  contributions: z
    .array(
      z.object({
        date: z.iso.date(),
        count: z.int().nonnegative(),
        level: z.int().min(0).max(4),
      }),
    )
    .min(1),
});

/** GitHub devuelve la intensidad como enum, no como número. */
const LEVELS = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
] as const;

const graphqlSchema = z.object({
  data: z.object({
    viewer: z.object({
      login: z.string().min(1),
      contributionsCollection: z.object({
        contributionCalendar: z.object({
          weeks: z
            .array(
              z.object({
                contributionDays: z.array(
                  z.object({
                    date: z.iso.date(),
                    contributionCount: z.int().nonnegative(),
                    contributionLevel: z.enum(LEVELS),
                  }),
                ),
              }),
            )
            .min(1),
        }),
      }),
    }),
  }),
});

/**
 * Se consulta `viewer` —el dueño del token— y no `user(login:)`: solo la
 * primera devuelve con certeza las contribuciones privadas. El login que
 * vuelve se compara contra el perfil del sitio para no publicar por error el
 * calendario de otra cuenta si el token no fuera el correcto.
 */
const QUERY = `{
  viewer {
    login
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays { date contributionCount contributionLevel }
        }
      }
    }
  }
}`;

/**
 * Aplana la respuesta de GraphQL a la misma forma que devuelve el proxy, para
 * que el resto del módulo no sepa de dónde vinieron los datos.
 */
export function daysFromGraphql(
  payload: unknown,
  expectedLogin: string,
): ContributionDay[] | null {
  const parsed = graphqlSchema.safeParse(payload);
  if (!parsed.success) return null;

  const { login, contributionsCollection } = parsed.data.data.viewer;
  if (login.toLowerCase() !== expectedLogin.toLowerCase()) return null;

  const days = contributionsCollection.contributionCalendar.weeks.flatMap(
    (week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVELS.indexOf(day.contributionLevel),
      })),
  );
  return days.length > 0 ? days : null;
}

async function fromGraphql(
  login: string,
  token: string,
): Promise<ContributionDay[] | null> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY }),
    // Sin esto Next no cachea un POST y la home dejaría de prerenderizarse.
    cache: "force-cache",
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) return null;
  return daysFromGraphql(await response.json(), login);
}

async function fromProxy(login: string): Promise<ContributionDay[] | null> {
  const response = await fetch(
    `${PROXY_ENDPOINT}/${encodeURIComponent(login)}?y=last`,
    { next: { revalidate: REVALIDATE_SECONDS } },
  );
  if (!response.ok) return null;

  const parsed = proxySchema.safeParse(await response.json());
  return parsed.success ? parsed.data.contributions : null;
}

/**
 * Devuelve el último año de contribuciones, o null si ninguna de las dos
 * fuentes responde. Nunca lanza: la home tiene que renderizar igual sin este
 * dato.
 */
export async function fetchContributions(
  username: string,
): Promise<ContributionCalendar | null> {
  const token = process.env.GITHUB_CONTRIBUTIONS_TOKEN;

  const attempts: {
    source: "graphql" | "proxy";
    run: () => Promise<ContributionDay[] | null>;
  }[] = [
    ...(token
      ? [
          {
            source: "graphql" as const,
            run: () => fromGraphql(username, token),
          },
        ]
      : []),
    { source: "proxy" as const, run: () => fromProxy(username) },
  ];

  for (const attempt of attempts) {
    try {
      const days = await attempt.run();
      if (!days) continue;
      if (token && attempt.source === "proxy") {
        // Sin este aviso, un token vencido solo se nota en que el total baja
        // de golpe: el calendario sigue apareciendo, pero sin lo privado.
        console.warn(
          "[github] GITHUB_CONTRIBUTIONS_TOKEN configurado pero GraphQL no respondió; se usaron solo las contribuciones públicas.",
        );
      }
      return {
        days,
        // Se suma en vez de leer el total que informa cada fuente para que el
        // número que se muestra coincida siempre con los cuadrados dibujados.
        total: days.reduce((sum, day) => sum + day.count, 0),
        source: attempt.source,
      };
    } catch {
      // Se prueba la fuente siguiente.
    }
  }

  return null;
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
