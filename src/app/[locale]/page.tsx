import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PortfolioHome } from "@/components/portfolio/Home";
import type { Locale } from "@/content/schema";
import { resolveCv } from "@/lib/cv-bridge";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: {
      absolute:
        resolveCv(locale as Locale).content?.site?.seoTitle || t("title"),
    },
    description:
      resolveCv(locale as Locale).content?.site?.seoDescription ||
      resolveCv(locale as Locale).content?.summary,
    alternates: alternatesFor(locale, ""),
  };
}

export default function HomePage() {
  return <PortfolioHome />;
}
