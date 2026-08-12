import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { RevealContent } from "@/components/ui/RevealContent";
import { WorkFilters } from "@/components/work/WorkFilters";
import { WorkGrid } from "@/components/work/WorkGrid";
import { projects } from "@/content/projects";
import { filterProjects, parseWorkFilter, sortByRecency } from "@/lib/projects";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Work" });

  return {
    title: t("title"),
    alternates: alternatesFor(locale, "/work"),
  };
}

export default async function WorkPage({
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const t = await getTranslations("Work");

  const filter = parseWorkFilter(type);
  const visible = sortByRecency(filterProjects(projects, filter));

  return (
    <Container>
      <RevealContent>
        <div className="pt-14">
          <h1 className="text-[2.1rem] text-primary leading-tight">
            {t("title")}
          </h1>
          <p className="mt-2 text-foreground">{t("subtitle")}</p>
        </div>
        <WorkFilters active={filter} />
        <WorkGrid projects={visible} />
      </RevealContent>
    </Container>
  );
}
