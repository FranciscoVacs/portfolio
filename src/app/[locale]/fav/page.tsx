import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PortfolioFavorites } from "@/components/portfolio/Favorites";
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
  return <PortfolioFavorites />;
}
