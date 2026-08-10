/**
 * URL pública del sitio. Vercel expone el dominio de producción en
 * VERCEL_PROJECT_PRODUCTION_URL; en desarrollo se usa localhost.
 */
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const SITE_PATHS = ["", "/work", "/fav", "/cv"] as const;
