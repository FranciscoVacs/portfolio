import { routing } from "@/i18n/routing";

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

if (process.env.VERCEL_ENV === "production" && !vercelUrl) {
  throw new Error("VERCEL_PROJECT_PRODUCTION_URL ausente en producción");
}

/**
 * URL pública del sitio. Vercel expone el dominio de producción en
 * VERCEL_PROJECT_PRODUCTION_URL; en desarrollo se usa localhost.
 */
export const SITE_URL = vercelUrl
  ? `https://${vercelUrl}`
  : "http://localhost:3000";

export const SITE_PATHS = ["", "/work", "/fav", "/cv"] as const;

/**
 * Canonical y hreflang propios de cada página. Sin esto las subpáginas
 * heredan el canonical del layout y se declaran duplicadas de la home.
 */
export function alternatesFor(locale: string, path: string) {
  return {
    canonical: `/${locale}${path}`,
    languages: Object.fromEntries(
      routing.locales.map((other) => [other, `/${other}${path}`]),
    ),
  };
}
