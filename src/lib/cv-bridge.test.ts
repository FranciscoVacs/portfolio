import { describe, expect, it } from "vitest";
import { catalogSchema, portfolioBundle, resolveCv } from "./cv-bridge";

const content = {
  name: "Test Person",
  email: "test@example.com",
  links: [],
  summary: "Current summary",
  experience: [
    {
      id: "work",
      organization: "Company",
      role: "Analyst",
      location: "Rosario",
      start: "2024-01",
      end: null,
      description: "Analyses data.",
      skills: ["Python"],
    },
  ],
  projects: [
    {
      id: "project",
      organization: "Project",
      role: "Developer",
      location: "",
      start: "2023-01",
      end: "2024-01",
      description: "Built a platform.",
      skills: ["Python"],
    },
  ],
  education: [],
  courses: [],
  skills: { technical: ["Python"], tools: ["Git"], additional: [] },
  languages: [{ name: "English", level: "B2" }],
  pdf: { classic: "/cv/gestion/test-es.pdf" },
};
const fixture = () =>
  catalogSchema.parse({
    schema: "gestion-cv-public-v1",
    defaultProfile: "analyst",
    profiles: [
      {
        id: "analyst",
        name: "Analista",
        digest: "test",
        translation: "ready",
        locales: {
          es: content,
          en: {
            ...content,
            summary: "English version",
            pdf: {
              classic: "/cv/gestion/test-en.pdf",
              europass: "/cv/gestion/test-europass.pdf",
            },
          },
        },
      },
    ],
  });

describe("conector del gestor de CV", () => {
  it("resuelve perfil principal y versión localizada sin mezclar perfiles", () => {
    const catalog = fixture();
    expect(resolveCv("es", undefined, catalog).content?.summary).toBe(
      "Current summary",
    );
    expect(resolveCv("en", "analyst", catalog).content?.summary).toBe(
      "English version",
    );
    expect(resolveCv("es", "unknown", catalog).entry).toBeUndefined();
  });
  it("nunca reemplaza una traducción pendiente con datos en español o del sitio anterior", () => {
    const catalog = fixture();
    catalog.profiles[0].locales.en = null;
    catalog.profiles[0].translation = "stale";
    const result = resolveCv("en", "analyst", catalog);
    expect(result.entry?.id).toBe("analyst");
    expect(result.content).toBeNull();
  });
  it("adapta el contenido a los componentes existentes con los PDFs correctos", () => {
    const catalog = fixture(),
      bundle = portfolioBundle(resolveCv("en", undefined, catalog).content);
    expect(bundle.profile.bio.en).toBe("English version");
    expect(bundle.profile.cv.en).toBe("/cv/gestion/test-en.pdf");
    expect(bundle.experience[0].period.end).toBeUndefined();
    expect(bundle.projects[0].story.en).toBe("Built a platform.");
    expect(bundle.skills).toEqual(["Python", "Git"]);
    expect(bundle.profile.github).toBe("");
  });
  it("rechaza rutas de PDF fuera de la carpeta generada", () => {
    const catalog = fixture();
    catalog.profiles[0].locales.es.pdf.classic = "https://example.com/file.pdf";
    expect(() => catalogSchema.parse(catalog)).toThrow();
  });
});
