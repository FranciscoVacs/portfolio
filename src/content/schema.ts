import { z } from "zod";

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export type Localized<T> = Record<Locale, T>;

export const PROJECT_CATEGORIES = ["personal", "contract", "client"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const FAV_CATEGORIES = [
  "youtube",
  "blogs",
  "tools",
  "learning",
] as const;
export type FavCategory = (typeof FAV_CATEGORIES)[number];

const localizedString = z.object({
  en: z.string().min(1),
  es: z.string().min(1),
});

const localizedStringList = z.object({
  en: z.array(z.string().min(1)).min(1),
  es: z.array(z.string().min(1)).min(1),
});

/** Mes en formato YYYY-MM, por ejemplo 2026-05. */
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, {
  message: "El período debe tener formato YYYY-MM",
});

const period = z.object({
  start: yearMonth,
  end: yearMonth.optional(),
});

export const projectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  category: z.enum(PROJECT_CATEGORIES),
  featured: z.boolean(),
  period,
  summary: localizedString,
  highlights: localizedStringList,
  stack: z.array(z.string().min(1)).min(1),
  links: z.object({
    live: z.url().optional(),
    repo: z.url().optional(),
    store: z.url().optional(),
  }),
  image: z
    .object({
      src: z.string().startsWith("/"),
      alt: localizedString,
      /** Dimensiones reales del archivo: fijan la relación de aspecto y
       * evitan que la tarjeta salte mientras la imagen carga. */
      width: z.int().positive(),
      height: z.int().positive(),
    })
    .optional(),
});

export const favItemSchema = z.object({
  name: z.string().min(1),
  url: z.url(),
  category: z.enum(FAV_CATEGORIES),
  note: localizedString,
});

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: localizedString,
  location: z.string().min(1),
  period,
  highlights: localizedStringList,
});

export const educationSchema = z.object({
  institution: z.string().min(1),
  degree: localizedString,
  location: z.string().min(1),
  period,
});

export const profileSchema = z.object({
  name: z.string().min(1),
  headline: localizedString,
  bio: localizedString,
  location: z.string().min(1),
  email: z.email(),
  github: z.url(),
  linkedin: z.url(),
  whatsapp: z.url().optional(),
  avatar: z.string().startsWith("/").optional(),
  cv: z.string().startsWith("/"),
});

export type Project = z.infer<typeof projectSchema>;
export type FavItem = z.infer<typeof favItemSchema>;
export type ExperienceItem = z.infer<typeof experienceSchema>;
export type EducationItem = z.infer<typeof educationSchema>;
export type Profile = z.infer<typeof profileSchema>;

/** Campos con los que una entrada de contenido se identifica a simple vista. */
type ContentIdentity = {
  slug?: unknown;
  name?: unknown;
  company?: unknown;
  institution?: unknown;
};

function identify(item: unknown): string | undefined {
  const candidate = item as ContentIdentity | null | undefined;
  const id =
    candidate?.slug ??
    candidate?.name ??
    candidate?.company ??
    candidate?.institution;
  return typeof id === "string" && id.length > 0 ? id : undefined;
}

/**
 * Valida un arreglo de contenido. Al fallar, el mensaje identifica el índice y
 * el nombre legible de la entrada para que el error de build sea accionable
 * incluso con decenas de registros.
 */
export function parseAll<T>(
  schema: z.ZodType<T>,
  items: unknown[],
  label: string,
): T[] {
  return items.map((item, index) => {
    const result = schema.safeParse(item);
    if (!result.success) {
      const id = identify(item);
      throw new Error(
        `Contenido inválido en ${label}[${index}]${id ? ` (${id})` : ""}:\n${JSON.stringify(
          z.treeifyError(result.error),
          null,
          2,
        )}`,
        { cause: result.error },
      );
    }
    return result.data;
  });
}
