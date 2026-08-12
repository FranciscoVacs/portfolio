import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { FavGroup } from "@/components/fav/FavGroup";
import { Container } from "@/components/layout/Container";
import { RevealContent } from "@/components/ui/RevealContent";
import { favItems } from "@/content/fav";
import { groupByCategory } from "@/lib/fav";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Fav" });

  return {
    title: t("title"),
    alternates: alternatesFor(locale, "/fav"),
  };
}

export default function FavPage() {
  const t = useTranslations("Fav");
  const groups = groupByCategory(favItems);

  return (
    <Container>
      <RevealContent>
        <div className="pt-14">
          <h1 className="text-[2.1rem] text-primary leading-tight">
            {t("title")}
          </h1>
          <p className="mt-2 text-foreground">{t("subtitle")}</p>
        </div>
        {groups.map((group) => (
          <FavGroup
            key={group.category}
            category={group.category}
            items={group.items}
          />
        ))}
      </RevealContent>
    </Container>
  );
}
