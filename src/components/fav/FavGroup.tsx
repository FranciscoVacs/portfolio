import { useLocale, useTranslations } from "next-intl";
import { DottedLink } from "@/components/ui/DottedLink";
import type { FavCategory, FavItem, Locale } from "@/content/schema";

export function FavGroup({
  category,
  items,
}: {
  category: FavCategory;
  items: FavItem[];
}) {
  const t = useTranslations("Fav");
  const locale = useLocale() as Locale;

  return (
    <section className="mt-14">
      <h2 className="mb-5 text-[1.4rem] text-primary leading-tight">
        {t(category)}
      </h2>
      <ul className="flex flex-col gap-6">
        {items.map((item) => (
          <li key={item.url}>
            <DottedLink href={item.url} external>
              {item.name}
            </DottedLink>
            <p className="mt-1 text-foreground text-sm leading-relaxed">
              {item.note[locale]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
