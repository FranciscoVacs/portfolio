import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Hero } from "@/components/home/Hero";
import { Timeline } from "@/components/home/Timeline";
import { Container } from "@/components/layout/Container";
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
  return (
    <Container>
      <Hero />
      <About />
      <Timeline />
      <FeaturedWork />
      <Contact />
    </Container>
  );
}
