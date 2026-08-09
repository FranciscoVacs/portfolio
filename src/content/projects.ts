import { type Project, parseAll, projectSchema } from "./schema";

export const projects: Project[] = parseAll(
  projectSchema,
  [
    {
      slug: "cunumi",
      title: "CUNUMI",
      category: "contract",
      featured: true,
      period: { start: "2026-05" },
      summary: {
        en: "Pet management, business management and social networking platform, shipped as a PWA and as a React Native app.",
        es: "Plataforma de gestión de mascotas, gestión de negocios y red social, publicada como PWA y como app React Native.",
      },
      highlights: {
        en: [
          "Designed and implemented the PostgreSQL schema on Supabase.",
          "Migrated the whole backend from Firebase to Supabase.",
          "Replaced the PWA with a cross-platform React Native app built with Expo.",
        ],
        es: [
          "Diseñé e implementé el esquema PostgreSQL sobre Supabase.",
          "Migré todo el backend de Firebase a Supabase.",
          "Reemplacé la PWA por una app multiplataforma en React Native con Expo.",
        ],
      },
      stack: ["React Native", "Expo", "TypeScript", "Supabase", "PostgreSQL"],
      links: {},
    },
    {
      slug: "bohemia",
      title: "Bohemia",
      category: "personal",
      featured: true,
      period: { start: "2024-07", end: "2025-02" },
      summary: {
        en: "Event management and ticketing platform with dynamic ticket generation, automated email delivery and payment gateway integration.",
        es: "Plataforma de gestión de eventos y venta de entradas, con generación dinámica de tickets, envío automático de mails e integración con pasarela de pago.",
      },
      highlights: {
        en: [
          "Built the frontend with Angular and Tailwind CSS.",
          "Developed a REST API covering authentication, events and galleries, with data persistence.",
          "Implemented dynamic ticket generation, automated email delivery and payment gateway integration.",
        ],
        es: [
          "Construí el frontend con Angular y Tailwind CSS.",
          "Desarrollé una API REST para autenticación, eventos y galerías, con persistencia de datos.",
          "Implementé la generación dinámica de tickets, el envío automático de mails y la integración con la pasarela de pago.",
        ],
      },
      stack: ["Angular", "TypeScript", "Tailwind CSS", "Node.js", "REST API"],
      links: { repo: "https://github.com/FranciscoVacs/Bohemia_FrontEnd" },
    },
  ],
  "projects",
);
