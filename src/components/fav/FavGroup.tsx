import { useLocale, useTranslations } from "next-intl";
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
    <section className="mt-12">
      <h2 className="mb-4 font-medium text-primary text-lg">{t(category)}</h2>
      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              {item.name}
            </a>
            <p className="mt-1 text-foreground text-sm leading-relaxed">
              {item.note[locale]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
