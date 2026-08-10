import { describe, expect, it } from "vitest";
import { type ContributionDay, monthLabels, toWeeks } from "./github";

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
