/**
 * Regenera src/lib/tech-icons.ts a partir del paquete `simple-icons`.
 *
 * simple-icons pesa 15 MB y solo hace falta para esto, asi que no queda
 * instalado. Para correrlo:
 *
 *   pnpm add -D simple-icons
 *   node scripts/gen-tech-icons.mjs
 *   pnpm remove simple-icons
 *
 * Agregar una tecnologia = agregarla a WANTED con su slug de simple-icons
 * (https://simpleicons.org) y volver a correr.
 */
import { writeFileSync } from "node:fs";
import * as si from "simple-icons";

/** [nombre visible en el badge, slug de simple-icons] */
const WANTED = [
  ["Angular", "angular"],
  ["React Native", "react"],
  ["React", "react"],
  ["Expo", "expo"],
  ["Node.js", "nodedotjs"],
  ["TypeScript", "typescript"],
  ["JavaScript", "javascript"],
  ["Tailwind CSS", "tailwindcss"],
  ["Python", "python"],
  ["PostgreSQL", "postgresql"],
  ["MySQL", "mysql"],
  ["Supabase", "supabase"],
  ["Git", "git"],
  ["GitHub", "github"],
  ["Next.js", "nextdotjs"],
  ["Firebase", "firebase"],
  ["Docker", "docker"],
];

// LinkedIn no esta en simple-icons (la marca pidio que lo retiraran), asi que
// los logos de contacto viven aparte, en src/lib/social-icons.ts.

/** Contraste minimo del logo contra el fondo del badge. */
const MIN_CONTRAST = 3;

/** Fondo real sobre el que se dibujan los logos: el papel del sitio. */
const BACKGROUND = "F5F1E8";

const toLinear = (v) =>
  v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
const channel = (hex, i) => parseInt(hex.slice(i, i + 2), 16) / 255;
const luminance = (hex) =>
  0.2126 * toLinear(channel(hex, 0)) +
  0.7152 * toLinear(channel(hex, 2)) +
  0.0722 * toLinear(channel(hex, 4));
const contrast = (hex) =>
  (luminance(BACKGROUND) + 0.05) / (luminance(hex) + 0.05);

/**
 * Oscurece multiplicando los tres canales por igual: baja la luminancia sin
 * mover el matiz, para que el logo siga siendo reconocible.
 */
function darkenToContrast(hex, target) {
  let factor = 1;
  let result = hex;
  while (contrast(result) < target && factor > 0.05) {
    factor -= 0.02;
    result = [0, 2, 4]
      .map((i) =>
        Math.round(parseInt(hex.slice(i, i + 2), 16) * factor)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("");
  }
  return result.toUpperCase();
}

/** Indice por slug: simple-icons exporta cada icono como `siNombre`. */
const bySlug = new Map(
  Object.values(si)
    .filter((icon) => icon && typeof icon === "object" && "slug" in icon)
    .map((icon) => [icon.slug, icon]),
);

const report = [];
const entries = [];

for (const [name, slug] of WANTED) {
  const icon = bySlug.get(slug);
  if (!icon) {
    console.error(`FALTA en simple-icons: ${name} (slug "${slug}")`);
    process.exitCode = 1;
    continue;
  }
  const ink =
    contrast(icon.hex) < MIN_CONTRAST
      ? darkenToContrast(icon.hex, MIN_CONTRAST)
      : icon.hex;
  report.push({
    name,
    marca: `#${icon.hex}`,
    usado: `#${ink}`,
    contraste: contrast(ink).toFixed(2),
    ajustado: ink !== icon.hex ? "si" : "",
  });
  // Clave sin comillas cuando es un identificador valido, como la deja el
  // formateador de Biome.
  const property = /^[A-Za-z_$][\w$]*$/.test(name) ? name : `"${name}"`;
  entries.push(
    `  ${property}: {
    hex: "#${ink}",
    path: "${icon.path}",
  },`,
  );
}

console.table(report);

writeFileSync(
  "src/lib/tech-icons.ts",
  `/**
 * Logos de marca para los badges de tecnologia. NO EDITAR A MANO.
 *
 * Generado por scripts/gen-tech-icons.mjs desde el paquete npm
 * \`simple-icons\` (CC0-1.0). Se vuelca aca para no arrastrar 15 MB de
 * dependencia ni depender de shields.io en runtime.
 *
 * \`hex\` no siempre es el color de marca exacto: los logos que sobre el papel
 * del sitio (#${BACKGROUND}) quedaban por debajo de ${MIN_CONTRAST}:1 de
 * contraste se oscurecen multiplicando los tres canales por igual, que baja la
 * luminancia sin mover el matiz.
 */
export type TechIcon = {
  /** Color del logo, ya ajustado para leerse sobre fondo claro. */
  hex: string;
  /** Path del SVG oficial de la marca, viewBox 0 0 24 24. */
  path: string;
};

export const TECH_ICONS: Record<string, TechIcon> = {
${entries.join("\n")}
};
`,
);
console.log("\nsrc/lib/tech-icons.ts regenerado");
