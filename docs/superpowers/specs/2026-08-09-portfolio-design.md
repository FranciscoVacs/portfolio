# Portfolio de Francisco Vacs — Diseño

Fecha: 2026-08-09
Estado: aprobado, listo para plan de implementación

## Contexto

Se descargó un template de portfolio de terceros (Next.js 14, Prisma, blog con
editor, autenticación, Cloudinary, Docker). El objetivo es tener un portfolio
propio de Francisco Vacs, con sus proyectos y su sección de recursos, hosteado
en Vercel.

Se decidió **no adaptar** ese template sino empezar un proyecto Next.js 15
limpio. La razón: cambian la versión del framework, el estilo visual, la
estructura de rutas, el idioma y el modelo de contenido. Migrar arrastra
decisiones ajenas y termina costando más que empezar de nuevo. Del template se
puede reaprovechar algún componente de shadcn/ui, que de todas formas se
regenera con el CLI.

Referencia de estilo acordada: https://github.com/urstruelysv/portfolio
(layout de una columna, sobrio, mucho espacio en blanco).

## Alcance

### Incluido

- Sitio estático bilingüe (inglés / español) con selector de idioma.
- Home con hero, about, experiencia, educación, proyectos destacados y contacto.
- Página Work con todos los proyectos y filtro por subcategoría.
- Página FAV con recursos recomendados (páginas, youtubers, influencers).
- Página CV con el PDF embebido y descarga.
- Modo claro y oscuro.
- Tests unitarios y de smoke end-to-end.
- Deploy continuo en Vercel.

### Explícitamente excluido

- Blog, editor de artículos y autenticación.
- Base de datos, Prisma, Drizzle, Docker.
- Cloudinary y cualquier subida de imágenes en runtime.
- Formulario de contacto y Resend. El contacto es por links directos.
- Dominio propio en esta etapa. Se publica en el subdominio de Vercel y la
  decisión del dominio queda para después.

Consecuencia de sacar la base de datos: Drizzle y Docker, que originalmente el
usuario quería usar, quedan fuera del proyecto. Se evaluó forzarlos con un panel
de administración o guardando mensajes de contacto, y se descartó por no
justificar la complejidad en un sitio de contenido estático.

## Transición desde el template descargado

El directorio de trabajo contiene hoy el template de terceros. El proyecto nuevo
se scaffoldea en el mismo directorio y los archivos del template se eliminan por
completo: `src/`, `prisma/`, `tests/`, `docker-compose.yml`, `.env.example`,
`.eslintrc.json`, `components.json`, `next.config.mjs`, `package.json`,
`package-lock.json`, `postcss.config.mjs`, `tailwind.config.ts`, `tsconfig.json`
y el contenido de `public/`.

Se conservan únicamente:

- `Vacs-Francisco-CV-eng.pdf`, que se mueve a `public/cv/`.
- `docs/`, con este documento.

El repositorio git se inicializa desde cero. El código del template no entra en
el historial, de modo que el repositorio publicado no contiene código ajeno ni
datos del autor original (que aparecían, por ejemplo, en la contraseña de
`docker-compose.yml`).

## Stack

| Área | Elección |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Componentes | shadcn/ui |
| Internacionalización | next-intl |
| Validación | Zod |
| Lint y formato | Biome (reemplaza ESLint + Prettier) |
| Tests unitarios | Vitest |
| Tests end-to-end | Playwright |
| Hosting | Vercel |

## Arquitectura

```
src/
  app/
    [locale]/
      layout.tsx
      page.tsx           # home
      work/page.tsx
      fav/page.tsx
      cv/page.tsx
    not-found.tsx
  components/
    layout/              Nav, Footer, LocaleSwitch, ThemeToggle
    home/                Hero, About, Timeline, FeaturedWork, Contact
    work/                WorkGrid, WorkCard, WorkFilters
    fav/                 FavGroup, FavCard
    ui/                  componentes de shadcn/ui
  content/
    profile.ts
    projects.ts
    fav.ts
    experience.ts
    education.ts
    schema.ts            esquemas Zod de todo el contenido
  lib/
    filters.ts           filtrado de proyectos por categoría
  i18n/
    routing.ts
    request.ts
messages/
  en.json
  es.json
public/
  work/                  capturas de proyectos
  cv/                    PDF del CV
```

### Separación de responsabilidades

La frontera principal es **`content/` versus `components/`**. Los componentes no
conocen ningún proyecto ni ningún link: reciben datos tipados por props. Agregar
un proyecto o un recurso significa editar un archivo de `content/` y nada más.

`messages/` contiene únicamente textos de interfaz (etiquetas de botones,
títulos de sección, nombres de filtros). Las traducciones del contenido propio
viven junto al contenido, porque un proyecto y su descripción en dos idiomas son
una sola unidad y deben editarse juntos.

`lib/filters.ts` aísla la lógica de filtrado para poder testearla sin renderizar
componentes.

## Modelo de contenido

### Tipos base

```ts
type Locale = 'en' | 'es';
type Localized<T> = Record<Locale, T>;
```

### Proyecto

```ts
type ProjectCategory = 'personal' | 'contract' | 'client';

interface Project {
  slug: string;                       // identificador único, usado en URLs
  title: string;                      // no se traduce
  category: ProjectCategory;
  featured: boolean;                  // aparece en la home
  period: { start: string; end?: string };  // formato YYYY-MM; sin end = actual
  summary: Localized<string>;         // una línea, va en la tarjeta
  highlights: Localized<string[]>;    // bullets de detalle
  stack: string[];                    // nombres de tecnologías, no se traducen
  links: { live?: string; repo?: string; store?: string };
  image?: { src: string; alt: Localized<string> };
}
```

`image` es opcional a propósito: las tarjetas se diseñan para verse bien con y
sin imagen, de modo que el sitio pueda publicarse antes de tener todas las
capturas.

### Recurso FAV

```ts
type FavCategory = 'youtube' | 'blogs' | 'tools' | 'learning';

interface FavItem {
  name: string;
  url: string;
  category: FavCategory;
  note: Localized<string>;   // por qué Francisco lo recomienda
}
```

La nota personal es obligatoria. Una lista de links sin contexto no aporta
valor; la recomendación explicada es lo que distingue esta sección.

### Validación

Todo el contenido se valida con Zod en el momento de importarse. Un campo
faltante, una categoría inexistente o un período mal formado hacen **fallar el
build** con un mensaje que identifica el registro problemático, en vez de
producir una página rota en producción.

## Páginas

### Home (`/[locale]`)

Secciones en orden:

1. **Hero** — nombre, foto, una línea sobre a qué se dedica, links a GitHub,
   LinkedIn y email.
2. **About** — resumen profesional en el idioma activo.
3. **Timeline** — experiencia (Cunumi, Profitwell) y educación (UTN, Escuela
   Provincial de Cine y Televisión, Instituto Politécnico Superior) en una línea
   de tiempo cronológica.
4. **Featured work** — los proyectos con `featured: true`, con link a `/work`.
5. **Contact** — links directos: email, LinkedIn, GitHub, WhatsApp.

### Work (`/[locale]/work`)

Todos los proyectos, con filtro por subcategoría: *All*, *Personales*,
*Contratos*, *Clientes*.

El filtro se implementa con un parámetro de búsqueda (`/work?type=contract`), no
con estado de cliente. Ventajas: se renderiza en el servidor, funciona sin
JavaScript, el estado filtrado es compartible por link y queda registrado en el
historial del navegador.

Un `type` inválido en la URL cae en *All* en lugar de mostrar una lista vacía.

Contenido inicial:

- **CUNUMI** — categoría `contract`. PWA y app React Native de gestión de
  mascotas, negocios y red social. Supabase, PostgreSQL, migración desde
  Firebase. Tiene demo en vivo y capturas.
- **Bohemia** — categoría `personal`. Plataforma de gestión de eventos: Angular,
  Tailwind, API REST, generación dinámica de tickets, envío de emails e
  integración con pasarela de pago. Frontend público en
  github.com/FranciscoVacs/Bohemia_FrontEnd.

Ambos marcados como `featured`.

### FAV (`/[locale]/fav`)

Recursos agrupados por categoría, cada uno con nombre, link y nota personal.
Los links externos abren en pestaña nueva con `rel="noopener noreferrer"`.

### CV (`/[locale]/cv`)

PDF embebido con botón de descarga. El archivo vive en `public/cv/`.

### Internacionalización

Rutas `/en` y `/es` gestionadas por el middleware de next-intl. El selector de
idioma conserva la ruta actual: desde `/es/work?type=contract` lleva a
`/en/work?type=contract`. Ambas versiones se indexan, con etiquetas `hreflang`
recíprocas.

La raíz `/` redirige al idioma detectado del navegador, con inglés como
respaldo.

## Estilo visual

Una columna centrada de ancho máximo contenido, tipografía cuidada, espaciado
generoso. Modo claro y oscuro con la preferencia del sistema como valor inicial
y persistencia de la elección del usuario.

Se descartan explícitamente los efectos del template original: magic cards con
gradiente que sigue al mouse, botones arcoíris, bordes brillantes y animaciones
de entrada con framer-motion. Motivos: envejecen mal, delatan el uso de una
plantilla y agregan peso de JavaScript sin aportar información.

## Manejo de errores

- Contenido inválido: falla el build vía Zod, con el registro identificado.
- Ruta inexistente: página 404 propia, traducida, con links de vuelta al sitio.
- Imagen de proyecto faltante o rota: la tarjeta se renderiza en su variante sin
  imagen, sin espacio vacío ni ícono roto.
- Locale desconocido en la URL: 404, no redirección silenciosa.

## Testing

**Vitest**

- Validación Zod del contenido real: cada proyecto y cada recurso FAV cumple su
  esquema.
- `lib/filters.ts`: filtrado por cada categoría, *All* devuelve todo, categoría
  inválida cae en *All*, categoría sin proyectos devuelve lista vacía.
- Selección de destacados y ordenamiento por período.

**Playwright**

- Las cuatro rutas cargan en ambos idiomas.
- El selector de idioma conserva ruta y parámetros de búsqueda.
- Los filtros de Work cambian la lista mostrada y la URL.
- Ningún link interno del sitio devuelve 404.
- El toggle de tema cambia el tema y persiste al recargar.

## Deploy

Repositorio nuevo en GitHub conectado a Vercel. Cada push a `main` publica a
producción; cada pull request genera una URL de preview. No hay variables de
entorno, así que la configuración se reduce a conectar el repositorio.

Se publica primero en el subdominio de Vercel. Conectar un dominio propio más
adelante no requiere cambios en el código.

## Puntos a confirmar durante la implementación

- URLs de demo en vivo de CUNUMI y Bohemia.
- Capturas de pantalla de ambos proyectos.
- Contenido inicial de la sección FAV (páginas, youtubers e influencers, con la
  nota de cada uno).
- Foto de perfil para el hero.
- Número de WhatsApp a publicar, o si se omite ese canal.
