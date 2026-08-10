import { describe, expect, it } from "vitest";
import type { FavItem } from "@/content/schema";
import { groupByCategory } from "./fav";

const items: FavItem[] = [
  {
    name: "A",
    url: "https://a.com",
    category: "tools",
    note: { en: "a", es: "a" },
  },
  {
    name: "B",
    url: "https://b.com",
    category: "youtube",
    note: { en: "b", es: "b" },
  },
  {
    name: "C",
    url: "https://c.com",
    category: "tools",
    note: { en: "c", es: "c" },
  },
];

describe("groupByCategory", () => {
  it("agrupa respetando el orden de FAV_CATEGORIES", () => {
    expect(groupByCategory(items).map((g) => g.category)).toEqual([
      "youtube",
      "tools",
    ]);
  });

  it("omite las categorías sin elementos", () => {
    expect(groupByCategory(items)).toHaveLength(2);
  });

  it("mantiene juntos los elementos de una categoría", () => {
    const tools = groupByCategory(items).find((g) => g.category === "tools");
    expect(tools?.items.map((i) => i.name)).toEqual(["A", "C"]);
  });
});
