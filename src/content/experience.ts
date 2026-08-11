import { type ExperienceItem, experienceSchema, parseAll } from "./schema";

export const experience: ExperienceItem[] = parseAll(
  experienceSchema,
  [
    {
      company: "CUNUMI",
      role: {
        en: "Full Stack Developer - Freelance Contract",
        es: "Desarrollador Full Stack - Contrato freelance",
      },
      location: "Rosario, Argentina",
      period: { start: "2026-05" },
      story: {
        en: "I joined to build the product from the database up: a PostgreSQL schema on Supabase for pets, businesses and the social side of the app. It started as a Progressive Web App, and along the way I moved the whole backend off Firebase and onto Supabase. Once the PWA hit its limits, I replaced it with a cross-platform React Native app.",
        es: "Entré para construir el producto desde la base de datos hacia arriba: un esquema PostgreSQL sobre Supabase para las mascotas, los negocios y la parte social de la app. Arrancó como Progressive Web App y en el camino migré todo el backend de Firebase a Supabase. Cuando la PWA tocó su techo, la reemplacé por una app multiplataforma en React Native.",
      },
    },
    {
      company: "Profitwell",
      role: {
        en: "Python Developer",
        es: "Desarrollador Python",
      },
      location: "Rosario, Argentina",
      period: { start: "2021-08", end: "2021-11" },
      story: {
        en: "My first job writing code for someone else. I built automation tools in Python that tied together external APIs and databases, working in a Scrum team and learning what Git looks like when more than one person touches the same branch.",
        es: "Mi primer trabajo escribiendo código para otros. Armé herramientas de automatización en Python que conectaban APIs externas con bases de datos, trabajando en un equipo con Scrum y aprendiendo cómo se ve Git cuando más de una persona toca la misma rama.",
      },
    },
  ],
  "experience",
);
