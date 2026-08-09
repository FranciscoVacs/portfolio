import { describe, expect, it } from "vitest";
import { favItemSchema, parseAll, projectSchema } from "./schema";

const validProject = {
  slug: "demo",
  title: "Demo",
  category: "personal" as const,
  featured: false,
  period: { start: "2024-01" },
  summary: { en: "A demo", es: "Una demo" },
  highlights: { en: ["One"], es: ["Uno"] },
  stack: ["TypeScript"],
  links: {},
};

describe("projectSchema", () => {
  it("acepta un proyecto válido", () => {
    expect(projectSchema.parse(validProject).slug).toBe("demo");
  });

  it("rechaza una categoría inexistente", () => {
    expect(() =>
      projectSchema.parse({ ...validProject, category: "freelance" }),
    ).toThrow();
  });

  it("rechaza un período mal formado", () => {
    expect(() =>
      projectSchema.parse({ ...validProject, period: { start: "2024" } }),
    ).toThrow();
  });

  it("rechaza un resumen que no está en los dos idiomas", () => {
    expect(() =>
      projectSchema.parse({ ...validProject, summary: { en: "Only English" } }),
    ).toThrow();
  });

  it("rechaza un link que no es una URL", () => {
    expect(() =>
      projectSchema.parse({
        ...validProject,
        links: { live: "no-soy-una-url" },
      }),
    ).toThrow();
  });
});

describe("favItemSchema", () => {
  it("exige la nota personal en los dos idiomas", () => {
    expect(() =>
      favItemSchema.parse({
        name: "Algo",
        url: "https://example.com",
        category: "tools",
        note: { en: "Useful" },
      }),
    ).toThrow();
  });
});

describe("parseAll", () => {
  it("identifica el registro que falla", () => {
    expect(() =>
      parseAll(
        projectSchema,
        [validProject, { ...validProject, slug: "" }],
        "projects",
      ),
    ).toThrow(/projects\[1\]/);
  });
});
