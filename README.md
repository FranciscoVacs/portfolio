# Portfolio — Francisco Vacs

Portfolio personal bilingüe (inglés / español). Sitio estático, sin base de datos.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, next-intl,
next-themes, Zod, Biome, Vitest y Playwright. Desplegado en Vercel.

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo en http://localhost:3000 |
| `pnpm build` | Build de producción |
| `pnpm lint` | Linting con Biome |
| `pnpm typecheck` | Chequeo de tipos |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm test:e2e` | Tests end-to-end (Playwright) |

## Cómo actualizar el contenido

Todo el contenido vive en `src/content/` y se valida con Zod al importarse.
Si un dato está mal, el build falla indicando el archivo y el índice.

| Archivo | Contenido |
|---|---|
| `profile.ts` | Nombre, bio, links de contacto, CV |
| `experience.ts` | Experiencia laboral |
| `education.ts` | Formación |
| `projects.ts` | Proyectos de la página Work |
| `fav.ts` | Recursos de la página FAV |

Los textos de interfaz (botones, títulos de sección) están en `messages/en.json`
y `messages/es.json`.

También se puede actualizar desde [GestionCV](docs/gestion-cv.md): los perfiles conectados se leen de `src/content/generated/cv.json` y sus PDFs se sirven desde `public/cv/gestion/`. Se conserva el mismo diseño en las vistas de cada perfil, con rutas en español e inglés. Subir la instantánea a `main` activa el despliegue de producción en Vercel.
