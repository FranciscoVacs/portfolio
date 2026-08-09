import { type FavItem, favItemSchema, parseAll } from "./schema";

export const favItems: FavItem[] = parseAll(
  favItemSchema,
  [
    {
      name: "Fireship",
      url: "https://www.youtube.com/@Fireship",
      category: "youtube",
      note: {
        en: "Short, dense videos that get you up to speed on a new tool in a few minutes.",
        es: "Videos cortos y densos que te ponen al día con una herramienta nueva en pocos minutos.",
      },
    },
    {
      name: "Theo — t3.gg",
      url: "https://www.youtube.com/@t3dotgg",
      category: "youtube",
      note: {
        en: "Opinionated takes on the TypeScript and React ecosystem, useful for spotting where the tooling is heading.",
        es: "Opiniones fuertes sobre el ecosistema TypeScript y React, útiles para ver hacia dónde va el tooling.",
      },
    },
    {
      name: "Josh W. Comeau",
      url: "https://www.joshwcomeau.com",
      category: "blogs",
      note: {
        en: "The clearest explanations of CSS layout and React internals I have found, with interactive examples.",
        es: "Las explicaciones más claras de layout en CSS e internals de React que encontré, con ejemplos interactivos.",
      },
    },
    {
      name: "MDN Web Docs",
      url: "https://developer.mozilla.org",
      category: "learning",
      note: {
        en: "The reference I actually trust for anything about the web platform.",
        es: "La referencia en la que realmente confío para cualquier cosa de la plataforma web.",
      },
    },
    {
      name: "Drizzle ORM",
      url: "https://orm.drizzle.team",
      category: "tools",
      note: {
        en: "The ORM I reach for in TypeScript projects: SQL-first, typed end to end, no hidden magic.",
        es: "El ORM que uso en proyectos TypeScript: pensado desde SQL, tipado de punta a punta y sin magia escondida.",
      },
    },
    {
      name: "Excalidraw",
      url: "https://excalidraw.com",
      category: "tools",
      note: {
        en: "Fastest way to sketch an architecture before writing any code.",
        es: "La forma más rápida de bocetar una arquitectura antes de escribir código.",
      },
    },
  ],
  "fav",
);
