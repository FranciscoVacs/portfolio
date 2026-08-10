import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { profile } from "@/content/profile";
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

  return (
    <Container>
      <div className="pt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="font-semibold text-2xl text-foreground tracking-tight">
            {t("title")}
          </h1>
          <a
            href={profile.cv}
            download
            className="text-foreground text-sm underline underline-offset-4"
          >
            {t("download")}
          </a>
        </div>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <object
        data={profile.cv}
        type="application/pdf"
        className="mt-10 h-[80vh] w-full rounded-lg border border-border"
        aria-label={t("title")}
      >
        <p className="p-6 text-muted-foreground">
          {t("fallback")}{" "}
          <a
            href={profile.cv}
            download
            className="text-foreground underline underline-offset-4"
          >
            <span className="sr-only">{t("fallback")} </span>
            {t("download")}
          </a>
        </p>
      </object>
    </Container>
  );
}
