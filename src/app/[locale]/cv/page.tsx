import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { DottedUnderline } from "@/components/ui/DottedLink";
import { RevealContent } from "@/components/ui/RevealContent";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/schema";
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
  const t = useTranslations("Cv");
  const locale = useLocale() as Locale;
  // Cada idioma muestra y descarga su propio PDF.
  const cv = profile.cv[locale];

  return (
    <Container>
      <RevealContent>
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
