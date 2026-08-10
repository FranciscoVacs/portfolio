import {
  FAV_CATEGORIES,
  type FavCategory,
  type FavItem,
} from "@/content/schema";

export type FavGroupData = { category: FavCategory; items: FavItem[] };

export function groupByCategory(items: FavItem[]): FavGroupData[] {
  return FAV_CATEGORIES.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);
}
