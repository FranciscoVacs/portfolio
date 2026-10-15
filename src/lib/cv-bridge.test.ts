import { describe, expect, it } from "vitest";
import { catalogSchema, portfolioBundle, resolveCv } from "./cv-bridge";
import { siteSchema } from "./portfolio-settings";

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
  it("permite casos vinculados a experiencias, fichas propias y redacción independiente", () => {
    const site = siteSchema.parse({
      avatar: "/avatar.png",
      headline: "Data analyst",
      location: "Buenos Aires",
      bio: "",
      whatsapp: "",
      githubUsername: "",
      seoTitle: "",
      seoDescription: "",
      sections: {},
      records: [
        {
          key: "experience:work",
          visible: true,
          description: "Expanded website story",
          url: "",
          logo: { src: "", alt: "", width: 1, height: 1 },
        },
      ],
      favorites: [],
      projects: [
        {
          id: "case",
          source: "experience:work",
          visible: true,
          featured: false,
          category: "contract",
          title: "Case study",
          summary: "",
          story: "",
          start: "",
          end: "",
          stack: [],
          links: { live: "", repo: "", store: "" },
          image: { src: "", alt: "", width: 1, height: 1 },
        },
        {
          id: "only-web",
          source: "",
          visible: true,
          featured: true,
          category: "personal",
          title: "Web only",
          summary: "Intro",
          story: "Story",
          start: "2026-10",
          end: "",
          stack: [],
          links: { live: "", repo: "", store: "" },
          image: { src: "", alt: "", width: 1, height: 1 },
        },
      ],
    });
    const data = catalogSchema.parse({
      ...fixture(),
      profiles: [
        {
          ...fixture().profiles[0],
          locales: { es: { ...content, site }, en: null },
        },
      ],
    }).profiles[0].locales.es;
    const bundle = portfolioBundle(data);
    expect(bundle.profile.location).toBe("Buenos Aires");
    expect(bundle.profile.bio.es).toBe(content.summary);
    expect(bundle.experience[0].story.es).toBe("Expanded website story");
    expect(bundle.projects.map((p) => p.title)).toEqual([
      "Case study",
      "Web only",
      "Project",
    ]);
    expect(bundle.projects[0].period.start).toBe(content.experience[0].start);
    expect(bundle.projects[0].category).toBe("contract");
    expect(bundle.projects[0].featured).toBe(false);
    expect(content.projects).toHaveLength(1);
    if (!data.site) throw new Error("Missing site fixture");
    data.site.records[0].visible = false;
    data.site.projects[0].source = "experience:removed";
    expect(portfolioBundle(data).experience).toHaveLength(0);
    expect(portfolioBundle(data).projects.map((p) => p.title)).not.toContain(
      "Case study",
    );
  });
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
