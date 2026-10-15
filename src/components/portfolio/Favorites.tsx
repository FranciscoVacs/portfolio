import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { FavGroup } from "@/components/fav/FavGroup";
import { ProfilePicker } from "@/components/home/ProfilePicker";
import { TranslationPending } from "@/components/home/TranslationPending";
import { Container } from "@/components/layout/Container";
import { RevealContent } from "@/components/ui/RevealContent";
import { favItems } from "@/content/fav";
import type { Locale } from "@/content/schema";
import { resolveCv } from "@/lib/cv-bridge";
import { groupByCategory } from "@/lib/fav";

export async function PortfolioFavorites({
  profileId,
}: {
  profileId?: string;
}) {
  const locale = (await getLocale()) as Locale,
    t = await getTranslations("Fav");
  const { entry, content } = resolveCv(locale, profileId);
  if (profileId && !entry) notFound();
  if (entry && (!content || content.site === null))
    return <TranslationPending id={entry.id} />;
  const items = content?.site
    ? content.site.sections.favorites === false
      ? []
      : content.site.favorites.map((f) => ({
          ...f,
          note: { es: f.note, en: f.note },
        }))
    : favItems;
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
        {groupByCategory(items).map((g) => (
          <FavGroup key={g.category} category={g.category} items={g.items} />
        ))}
      </RevealContent>
    </Container>
  );
}
