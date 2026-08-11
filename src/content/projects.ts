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
      story: {
        en: "The data model came first: a PostgreSQL schema on Supabase that had to hold pets, allied businesses and a social feed without turning into three separate products. The backend started on Firebase and I moved all of it to Supabase. The app shipped as a PWA until that stopped being enough, and then became a React Native app with Expo.",
        es: "El modelo de datos vino primero: un esquema PostgreSQL sobre Supabase que tenía que sostener mascotas, negocios aliados y un feed social sin convertirse en tres productos distintos. El backend arrancó en Firebase y lo migré entero a Supabase. La app se publicó como PWA hasta que eso dejó de alcanzar, y ahí pasó a ser una app React Native con Expo.",
      },
      stack: ["React Native", "Expo", "TypeScript", "Supabase", "PostgreSQL"],
      links: { live: "https://cunumi.app/welcome" },
      image: {
        src: "/work/cunumi.png",
        alt: {
          en: "Three phone screens from CUNUMI: community browser, allied businesses map and a pet profile.",
          es: "Tres pantallas de CUNUMI: explorador de comunidades, mapa de negocios aliados y el perfil de una mascota.",
        },
        width: 1920,
        height: 1440,
      },
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
      story: {
        en: "A ticketing platform for a real venue, which meant the interesting part was never the interface: tickets are generated on the fly, mail goes out on its own and money changes hands through a payment gateway. I built the Angular frontend and the REST API behind it, covering authentication, events and galleries.",
        es: "Una plataforma de entradas para un lugar que existe, así que lo interesante nunca fue la interfaz: los tickets se generan al vuelo, los mails salen solos y hay plata pasando por una pasarela de pago. Construí el frontend en Angular y la API REST detrás, con autenticación, eventos y galerías.",
      },
      stack: ["Angular", "TypeScript", "Tailwind CSS", "Node.js", "REST API"],
      links: { live: "https://www.bohemia-socialclub.me" },
      image: {
        src: "/work/bohemia.png",
        alt: {
          en: "Bohemia home page showing the next event with its date, venue, lineup and ticket purchase button.",
          es: "Portada de Bohemia con el próximo evento: fecha, dirección, lineup y el botón de compra de entradas.",
        },
        width: 2068,
        height: 1077,
      },
    },
  ],
  "projects",
);
