import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PortfolioWork } from "@/components/portfolio/Work";
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
  searchParams: Promise<{ type?: string }>;
}) {
  return <PortfolioWork type={(await searchParams).type} />;
}
