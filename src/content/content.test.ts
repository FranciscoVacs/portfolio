import { readFileSync } from "node:fs";
import { join } from "node:path";
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

  it("apunta las imágenes de proyecto a archivos reales de public/", () => {
    for (const project of projects) {
      if (!project.image) continue;
      const file = join(process.cwd(), "public", project.image.src);
      expect(() => readFileSync(file), project.slug).not.toThrow();
    }
  });

  it("declara las dimensiones reales de cada imagen de proyecto", () => {
    // Un width/height desincronizado del archivo deforma la miniatura y
    // provoca salto de layout, sin que nada más lo delate.
    for (const project of projects) {
      if (!project.image) continue;
      const png = readFileSync(
        join(process.cwd(), "public", project.image.src),
      );
      expect(png.subarray(12, 16).toString("ascii"), project.slug).toBe("IHDR");
      expect({
        width: png.readUInt32BE(16),
        height: png.readUInt32BE(20),
      }).toEqual({
        width: project.image.width,
        height: project.image.height,
      });
    }
  });

  it("no repite URLs en FAV", () => {
    const urls = favItems.map((f) => f.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
