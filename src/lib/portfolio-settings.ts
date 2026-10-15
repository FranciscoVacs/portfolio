import { z } from "zod";

const image = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
});
export const siteSchema = z.object({
  links: z
    .array(z.object({ id: z.string(), label: z.string(), url: z.url() }))
    .optional(),
  avatar: z.string(),
  headline: z.string(),
  location: z.string(),
  bio: z.string(),
  whatsapp: z.string(),
  githubUsername: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  sections: z.record(z.string(), z.boolean()),
  records: z.array(
    z.object({
      key: z.string(),
      visible: z.boolean(),
      description: z.string(),
      url: z.string(),
      logo: image,
    }),
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      visible: z.boolean(),
      featured: z.boolean(),
      category: z.enum(["personal", "contract"]),
      title: z.string(),
      summary: z.string(),
      story: z.string(),
      start: z.string(),
      end: z.string(),
      stack: z.array(z.string()),
      image,
      links: z.object({
        live: z.string(),
        repo: z.string(),
        store: z.string(),
      }),
    }),
  ),
  favorites: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      category: z.enum(["youtube", "blogs", "tools", "learning"]),
      note: z.string(),
    }),
  ),
});
