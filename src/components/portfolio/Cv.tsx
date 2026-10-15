import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ProfilePicker } from "@/components/home/ProfilePicker";
import { TranslationPending } from "@/components/home/TranslationPending";
import { Container } from "@/components/layout/Container";
import { DottedUnderline } from "@/components/ui/DottedLink";
import { RevealContent } from "@/components/ui/RevealContent";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/schema";
import { resolveCv } from "@/lib/cv-bridge";

export async function PortfolioCv({ profileId }: { profileId?: string }) {
  const t = await getTranslations("Cv");
  const locale = (await getLocale()) as Locale;
  const { entry, content } = resolveCv(locale, profileId);
  if (profileId && !entry) notFound();
  if (entry && !content) return <TranslationPending id={entry.id} />;
  // Cada idioma muestra y descarga su propio PDF.
  const cv = content?.pdf.classic || profile.cv[locale];

  return (
    <Container>
      <RevealContent>
        {entry ? <ProfilePicker active={entry.id} /> : null}
        <div className="pt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h1 className="text-[2.1rem] text-primary leading-tight">
              {t("title")}
            </h1>
            <a
              href={cv}
              download
              className="group text-primary text-sm transition-colors hover:text-brand"
            >
              <span className="relative inline-block">
                {t("download")}
                <DottedUnderline />
              </span>
            </a>
          </div>
          <p className="mt-2 text-foreground">{t("subtitle")}</p>
        </div>

        {content?.pdf.europass ? (
          <a
            href={content.pdf.europass}
            download
            className="mt-5 inline-block text-primary text-sm underline underline-offset-4"
          >
            Download Europass PDF
          </a>
        ) : null}

        <object
          data={cv}
          type="application/pdf"
          className="mt-10 h-[80vh] w-full rounded-lg border border-border"
          aria-label={t("title")}
        >
          <p className="p-6 text-foreground">
            {t("fallback")}{" "}
            <a
              href={cv}
              download
              className="group text-primary transition-colors hover:text-brand"
            >
              <span className="sr-only">{t("fallback")} </span>
              <span className="relative inline-block">
                {t("download")}
                <DottedUnderline />
              </span>
            </a>
          </p>
        </object>
      </RevealContent>
    </Container>
  );
}
