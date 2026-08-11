import { useTranslations } from "next-intl";
import { DottedUnderline } from "@/components/ui/DottedLink";
import { Link } from "@/i18n/navigation";
import type { WorkFilter } from "@/lib/projects";

const FILTERS: WorkFilter[] = ["all", "personal", "contract"];

export function WorkFilters({ active }: { active: WorkFilter }) {
  const t = useTranslations("Work");

  return (
    <nav
      aria-label={t("filterLabel")}
      className="mt-8 flex flex-wrap gap-5 font-mono text-xs uppercase tracking-wide"
    >
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
              ? "group text-primary transition-colors"
              : "group text-foreground transition-colors hover:text-primary"
          }
        >
          <span className="relative inline-block">
            {t(filter)}
            <DottedUnderline onlyOnHover forceVisible={filter === active} />
          </span>
        </Link>
      ))}
    </nav>
  );
}
