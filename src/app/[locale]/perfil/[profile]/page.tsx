import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioHome } from "@/components/portfolio/Home";
import { cvCatalog } from "@/lib/cv-bridge";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; profile: string }>;
}): Promise<Metadata> {
  const { locale, profile } = await params;
  const entry = cvCatalog.profiles.find((p) => p.id === profile);
  if (!entry) notFound();
  return {
    title: entry.name,
    alternates: alternatesFor(locale, `/perfil/${profile}`),
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  return <PortfolioHome profileId={(await params).profile} />;
}
