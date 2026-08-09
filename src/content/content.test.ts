import { describe, expect, it } from "vitest";
import { education } from "./education";
import { experience } from "./experience";
import { favItems } from "./fav";
import { profile } from "./profile";
import { projects } from "./projects";

describe("contenido del sitio", () => {
  it("tiene un perfil cargado", () => {
    expect(profile.name).toBe("Francisco Vacs");
  });

  it("tiene experiencia y educación", () => {
    expect(experience.length).toBeGreaterThan(0);
    expect(education.length).toBeGreaterThan(0);
  });

  it("tiene al menos dos proyectos", () => {
    expect(projects.length).toBeGreaterThanOrEqual(2);
  });

  it("no repite slugs de proyecto", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("tiene al menos un proyecto destacado", () => {
    expect(projects.some((p) => p.featured)).toBe(true);
  });

  it("no repite URLs en FAV", () => {
    const urls = favItems.map((f) => f.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
