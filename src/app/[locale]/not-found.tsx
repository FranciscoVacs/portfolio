import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";

export default function LocaleNotFound() {
  const t = useTranslations("NotFound");

  return (
    <Container>
      <div className="py-24">
        <h1 className="font-semibold text-2xl text-primary tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-2 text-foreground">{t("description")}</p>
        <Link
          href="/"
          className="mt-6 inline-block text-primary text-sm underline underline-offset-4"
        >
          {t("backHome")}
        </Link>
      </div>
    </Container>
  );
}
