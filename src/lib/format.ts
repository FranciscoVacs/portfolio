import type { Locale } from "@/content/schema";

type Period = { start: string; end?: string };

function formatMonth(yearMonth: string, locale: Locale): string {
  const [year, month] = yearMonth.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  const formatted = new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  return formatted.replace(".", "");
}

export function formatPeriod(
  period: Period,
  presentLabel: string,
  locale: Locale,
): string {
  const start = formatMonth(period.start, locale);
  const end = period.end ? formatMonth(period.end, locale) : presentLabel;
  return `${start} — ${end}`;
}
