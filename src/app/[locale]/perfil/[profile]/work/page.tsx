import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PortfolioWork } from "@/components/portfolio/Work";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; profile: string }>;
}): Promise<Metadata> {
  const { locale, profile } = await params;
  const t = await getTranslations({ locale, namespace: "Work" });
  return {
    title: t("title"),
    alternates: alternatesFor(locale, `/perfil/${profile}/work`),
  };
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ profile: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  return (
    <PortfolioWork
      profileId={(await params).profile}
      type={(await searchParams).type}
    />
  );
}
