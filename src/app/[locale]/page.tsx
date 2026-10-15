import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PortfolioHome } from "@/components/portfolio/Home";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: { absolute: t("title") },
    alternates: alternatesFor(locale, ""),
  };
}

export default function HomePage() {
  return <PortfolioHome />;
}
