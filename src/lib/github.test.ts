import { describe, expect, it } from "vitest";
import {
  type ContributionDay,
  daysFromGraphql,
  monthLabels,
  toWeeks,
} from "./github";

/** Genera días consecutivos desde una fecha, con contribuciones en cero. */
function daysFrom(start: string, count: number): ContributionDay[] {
  const first = new Date(`${start}T00:00:00Z`);
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(first);
    date.setUTCDate(date.getUTCDate() + i);
    return { date: date.toISOString().slice(0, 10), count: 0, level: 0 };
  });
}

const dayOfWeek = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

describe("toWeeks", () => {
  // 2025-08-10 es domingo; 2025-08-13, miércoles.
  it("arranca cada columna en domingo aunque el primer día no lo sea", () => {
    for (const start of ["2025-08-10", "2025-08-13", "2025-08-16"]) {
      const weeks = toWeeks(daysFrom(start, 366));
      for (const week of weeks) {
        expect(dayOfWeek(week[0].date), `semana de ${start}`).toBe(0);
      }
    }
  });

  it("deja todas las semanas de siete días", () => {
    const weeks = toWeeks(daysFrom("2025-08-13", 366));
    expect(weeks.every((week) => week.length === 7)).toBe(true);
  });

  it("conserva todos los días reales y no inventa ninguno", () => {
    const days = daysFrom("2025-08-13", 366);
    const real = toWeeks(days)
      .flat()
      .filter((cell) => !cell.filler);
    expect(real.map((cell) => cell.date)).toEqual(days.map((day) => day.date));
  });

  it("marca como relleno solo lo que agrega en los extremos", () => {
    // 2025-08-13 es miércoles: sobran 3 huecos antes (dom, lun, mar).
    const weeks = toWeeks(daysFrom("2025-08-13", 10));
    const fillers = weeks.flat().filter((cell) => cell.filler);
    expect(fillers.slice(0, 3).map((cell) => cell.date)).toEqual([
      "2025-08-10",
      "2025-08-11",
      "2025-08-12",
    ]);
  });
});

describe("monthLabels", () => {
  it("rotula un mes por cambio, sin repetir", () => {
    const labels = monthLabels(toWeeks(daysFrom("2025-08-13", 366)));
    const months = labels.map((label) => label.month);
    expect(new Set(months).size).toBe(months.length);
  });

  it("no rotula la primera columna, donde la etiqueta no entra", () => {
    const labels = monthLabels(toWeeks(daysFrom("2025-08-13", 366)));
    expect(labels.every((label) => label.column > 0)).toBe(true);
  });

  it("deja las columnas en orden creciente", () => {
    const columns = monthLabels(toWeeks(daysFrom("2025-08-13", 366))).map(
      (label) => label.column,
    );
    expect(columns).toEqual([...columns].sort((a, b) => a - b));
  });
});

/** Respuesta de GitHub recortada a lo que consume daysFromGraphql. */
const graphqlPayload = (
  days: {
    date: string;
    contributionCount: number;
    contributionLevel: string;
  }[],
) => ({
  data: {
    viewer: {
      login: "FranciscoVacs",
      contributionsCollection: {
        contributionCalendar: {
          weeks: [{ contributionDays: days }],
        },
      },
    },
  },
});

describe("daysFromGraphql", () => {
  it("traduce el enum de intensidad al número que usa el calendario", () => {
    const days = daysFromGraphql(
      graphqlPayload([
        { date: "2026-08-03", contributionCount: 0, contributionLevel: "NONE" },
        {
          date: "2026-08-04",
          contributionCount: 2,
          contributionLevel: "FIRST_QUARTILE",
        },
        {
          date: "2026-08-05",
          contributionCount: 9,
          contributionLevel: "FOURTH_QUARTILE",
        },
      ]),
      "FranciscoVacs",
    );
    expect(days).toEqual([
      { date: "2026-08-03", count: 0, level: 0 },
      { date: "2026-08-04", count: 2, level: 1 },
      { date: "2026-08-05", count: 9, level: 4 },
    ]);
  });

  it("devuelve null si la forma de la respuesta no es la esperada", () => {
    // Un cambio de contrato o un error de GitHub tiene que degradar al proxy,
    // no reventar el render de la home.
    const login = "FranciscoVacs";
    expect(
      daysFromGraphql({ errors: [{ message: "Bad credentials" }] }, login),
    ).toBe(null);
    expect(daysFromGraphql({ data: { viewer: null } }, login)).toBe(null);
    expect(daysFromGraphql(null, login)).toBe(null);
  });

  it("rechaza un nivel de intensidad desconocido", () => {
    expect(
      daysFromGraphql(
        graphqlPayload([
          {
            date: "2026-08-03",
            contributionCount: 1,
            contributionLevel: "FIFTH_QUARTILE",
          },
        ]),
        "FranciscoVacs",
      ),
    ).toBe(null);
  });

  it("descarta la respuesta si el token es de otra cuenta", () => {
    // Un token equivocado publicaría el calendario de otra persona como si
    // fuera propio; mejor caer al proxy, que sí filtra por login.
    expect(
      daysFromGraphql(
        graphqlPayload([
          {
            date: "2026-08-03",
            contributionCount: 5,
            contributionLevel: "NONE",
          },
        ]),
        "OtraCuenta",
      ),
    ).toBe(null);
  });
});
