import { PortfolioFavorites } from "@/components/portfolio/Favorites";
import { alternatesFor } from "@/lib/site";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; profile: string }>;
}) {
  const { locale, profile } = await params;
  return {
    title: "FAV",
    alternates: alternatesFor(locale, `/perfil/${profile}/fav`),
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  return <PortfolioFavorites profileId={(await params).profile} />;
}
