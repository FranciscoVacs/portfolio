import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ProfilePicker } from "@/components/home/ProfilePicker";
import { TranslationPending } from "@/components/home/TranslationPending";
import { Container } from "@/components/layout/Container";
import { RevealContent } from "@/components/ui/RevealContent";
import { WorkFilters } from "@/components/work/WorkFilters";
import { WorkGrid } from "@/components/work/WorkGrid";
import type { Locale } from "@/content/schema";
import { portfolioBundle, resolveCv } from "@/lib/cv-bridge";
import { filterProjects, parseWorkFilter, sortByRecency } from "@/lib/projects";

export async function PortfolioWork({
  profileId,
  type,
}: {
  profileId?: string;
  type?: string;
}) {
  const locale = (await getLocale()) as Locale;
  const { entry, content } = resolveCv(locale, profileId);
  if (profileId && !entry) notFound();
  if (entry && !content) return <TranslationPending id={entry.id} />;
  const { projects } = portfolioBundle(content);
  const t = await getTranslations("Work");

  const filter = parseWorkFilter(type);
  const visible = sortByRecency(filterProjects(projects, filter));

  return (
    <Container>
      <RevealContent>
        {entry ? <ProfilePicker active={entry.id} /> : null}
        <div className="pt-14">
          <h1 className="text-[2.1rem] text-primary leading-tight">
            {t("title")}
          </h1>
          <p className="mt-2 text-foreground">{t("subtitle")}</p>
        </div>
        <WorkFilters
          active={filter}
          path={profileId ? `/perfil/${profileId}/work` : "/work"}
        />
        <WorkGrid projects={visible} />
      </RevealContent>
    </Container>
  );
}
