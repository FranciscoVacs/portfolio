import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { cvCatalog } from "@/lib/cv-bridge";
import { SITE_PATHS, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    [
      ...SITE_PATHS,
      ...cvCatalog.profiles.flatMap((p) =>
        ["", "/work", "/cv", "/fav"].map((s) => `/perfil/${p.id}${s}`),
      ),
    ].map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((other) => [
            other,
            `${SITE_URL}/${other}${path}`,
          ]),
        ),
      },
    })),
  );
}
