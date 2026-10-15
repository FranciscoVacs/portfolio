import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PortfolioCv } from "@/components/portfolio/Cv";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cv" });

  return {
    title: t("title"),
    alternates: alternatesFor(locale, "/cv"),
  };
}

export default function CvPage() {
  return <PortfolioCv />;
}
