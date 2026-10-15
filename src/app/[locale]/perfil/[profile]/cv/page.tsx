import type { Metadata } from "next";
import { PortfolioCv } from "@/components/portfolio/Cv";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; profile: string }>;
}): Promise<Metadata> {
  const { locale, profile } = await params;
  return {
    title: "CV",
    alternates: alternatesFor(locale, `/perfil/${profile}/cv`),
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  return <PortfolioCv profileId={(await params).profile} />;
}
