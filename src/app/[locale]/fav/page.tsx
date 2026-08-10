import { useTranslations } from "next-intl";
import { FavGroup } from "@/components/fav/FavGroup";
import { Container } from "@/components/layout/Container";
import { favItems } from "@/content/fav";
import { groupByCategory } from "@/lib/fav";

export default function FavPage() {
  const t = useTranslations("Fav");
  const groups = groupByCategory(favItems);

  return (
    <Container>
      <div className="pt-14">
        <h1 className="font-semibold text-2xl text-foreground tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>
      {groups.map((group) => (
        <FavGroup
          key={group.category}
          category={group.category}
          items={group.items}
        />
      ))}
    </Container>
  );
}
