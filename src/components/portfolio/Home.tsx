import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { GithubActivity } from "@/components/home/GithubActivity";
import { Hero } from "@/components/home/Hero";
import { ProfileDetails } from "@/components/home/ProfileDetails";
import { ProfilePicker } from "@/components/home/ProfilePicker";
import { Skills } from "@/components/home/Skills";
import { Timeline } from "@/components/home/Timeline";
import { TranslationPending } from "@/components/home/TranslationPending";
import { Container } from "@/components/layout/Container";
import { RevealContent } from "@/components/ui/RevealContent";
import type { Locale } from "@/content/schema";
import { portfolioBundle, resolveCv } from "@/lib/cv-bridge";

export async function PortfolioHome({ profileId }: { profileId?: string }) {
  const locale = (await getLocale()) as Locale;
  const { entry, content } = resolveCv(locale, profileId);
  if (profileId && !entry) notFound();
  if (entry && !content) return <TranslationPending id={entry.id} />;
  const bundle = portfolioBundle(content);
  return (
    <Container>
      <RevealContent>
        {entry ? <ProfilePicker active={entry.id} /> : null}
        <Hero profile={bundle.profile} />
        <About profile={bundle.profile} />
        <Skills skills={bundle.skills} />
        <Timeline experience={bundle.experience} education={bundle.education} />
        <FeaturedWork
          projects={bundle.projects}
          workHref={profileId ? `/perfil/${profileId}/work` : "/work"}
        />
        {content ? <ProfileDetails content={content} /> : null}
        <GithubActivity />
        <Contact profile={bundle.profile} />
      </RevealContent>
    </Container>
  );
}
