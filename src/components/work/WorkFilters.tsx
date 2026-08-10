import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { WorkFilter } from "@/lib/projects";

const FILTERS: WorkFilter[] = ["all", "personal", "contract", "client"];

export function WorkFilters({ active }: { active: WorkFilter }) {
  const t = useTranslations("Work");

  return (
    <nav aria-label={t("title")} className="mt-8 flex flex-wrap gap-4 text-sm">
      {FILTERS.map((filter) => (
        <Link
          key={filter}
          href={
            filter === "all"
              ? "/work"
              : { pathname: "/work", query: { type: filter } }
          }
          className={
            filter === active
              ? "font-medium text-foreground underline underline-offset-4"
              : "text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {t(filter)}
        </Link>
      ))}
    </nav>
  );
}
