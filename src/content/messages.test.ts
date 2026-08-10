import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import { FAV_CATEGORIES, PROJECT_CATEGORIES } from "./schema";

const flatten = (o: object, p = ""): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    typeof v === "object" && v !== null
      ? flatten(v, `${p}${k}.`)
      : [`${p}${k}`],
  );

describe("mensajes de interfaz", () => {
  it("en.json y es.json tienen exactamente las mismas claves", () => {
    expect(flatten(en).sort()).toEqual(flatten(es).sort());
  });

  it("cada categoría de FAV tiene traducción en los dos idiomas", () => {
    for (const c of FAV_CATEGORIES) {
      expect(en.Fav).toHaveProperty(c);
      expect(es.Fav).toHaveProperty(c);
    }
  });

  it("cada categoría de proyecto tiene traducción en los dos idiomas", () => {
    for (const c of [...PROJECT_CATEGORIES, "all"]) {
      expect(en.Work).toHaveProperty(c);
      expect(es.Work).toHaveProperty(c);
    }
  });
});
