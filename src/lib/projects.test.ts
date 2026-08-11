import { describe, expect, it } from "vitest";
import type { Project } from "@/content/schema";
import {
  featuredProjects,
  filterProjects,
  parseWorkFilter,
  sortByRecency,
} from "./projects";

function make(overrides: Partial<Project>): Project {
  return {
    slug: "x",
    title: "X",
    category: "personal",
    featured: false,
    period: { start: "2024-01" },
    summary: { en: "a", es: "a" },
    story: { en: "a", es: "a" },
    stack: ["TypeScript"],
    links: {},
    ...overrides,
  };
}

const personal = make({
  slug: "p",
  category: "personal",
  period: { start: "2024-01" },
});
const contract = make({
  slug: "c",
  category: "contract",
  featured: true,
  period: { start: "2026-05" },
});
const client = make({
  slug: "cl",
  category: "client",
  period: { start: "2025-03" },
});
const all = [personal, contract, client];

describe("parseWorkFilter", () => {
  it('devuelve "all" cuando no hay parámetro', () => {
    expect(parseWorkFilter(undefined)).toBe("all");
  });

  it("devuelve la categoría cuando es válida", () => {
    expect(parseWorkFilter("contract")).toBe("contract");
  });

  it('cae en "all" cuando la categoría no existe', () => {
    expect(parseWorkFilter("freelance")).toBe("all");
  });
});

describe("filterProjects", () => {
  it('devuelve todo con el filtro "all"', () => {
    expect(filterProjects(all, "all")).toHaveLength(3);
  });

  it("filtra por categoría", () => {
    expect(filterProjects(all, "contract")).toEqual([contract]);
  });

  it("devuelve lista vacía si ninguna coincide", () => {
    expect(filterProjects([personal], "client")).toEqual([]);
  });

  it("no muta el arreglo original", () => {
    filterProjects(all, "contract");
    expect(all).toHaveLength(3);
  });
});

describe("sortByRecency", () => {
  it("ordena del más reciente al más antiguo", () => {
    expect(sortByRecency(all).map((p) => p.slug)).toEqual(["c", "cl", "p"]);
  });
});

describe("featuredProjects", () => {
  it("devuelve solo los destacados", () => {
    expect(featuredProjects(all).map((p) => p.slug)).toEqual(["c"]);
  });
});
