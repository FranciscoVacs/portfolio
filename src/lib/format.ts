import type { Locale } from "@/content/schema";

type Period = { start: string; end?: string };

/**
 * Mes y año escritos completos: "mayo 2026", no "may 2026". Intl devuelve el
 * mes en minúscula en español y en mayúscula en inglés; se respeta cada
 * convención en lugar de forzar una sola.
 */
function formatMonth(yearMonth: string, locale: Locale): string {
  const [year, month] = yearMonth.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatPeriod(
  period: Period,
  presentLabel: string,
  locale: Locale,
): string {
  const start = formatMonth(period.start, locale);
  const end = period.end ? formatMonth(period.end, locale) : presentLabel;
  return `${start} - ${end}`;
}
