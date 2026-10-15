# Datos sincronizados desde GestionCV

El sitio puede leer una instantánea de perfiles profesionales generada por la aplicación privada `../GestionCV`. No necesita consultar ese servidor en producción.

La conexión se activa en el gestor, botón **Portfolio ↗**, para cada perfil que se quiera compartir. Genera `src/content/generated/cv.json` y PDFs en `public/cv/gestion/`. Ambos forman parte del contenido que se debe incluir al desplegar el portfolio.

`src/lib/cv-bridge.ts` valida el contrato `gestion-cv-public-v1` con Zod y adapta sus datos a los componentes existentes. El contenido manual de `src/content/` permanece disponible como respaldo cuando no hay perfiles conectados. No editar a mano el JSON generado: lo reemplaza el gestor.

El perfil principal aparece en las rutas habituales. Cada perfil también tiene `/es/perfil/<id>` y `/en/perfil/<id>`, con `/work` y `/cv`. Cambiar idioma o navegar a CV/Work conserva el perfil. Una traducción faltante o desactualizada muestra un aviso, sin mezclar datos con otro idioma o perfil. El PDF Europass está disponible en la página CV inglesa.

El contenido público incluye datos y PDFs del CV. No se copian archivos adjuntos de certificados ni el historial privado del gestor. Los PDFs incluyen los campos visibles de sus plantillas.

Los logos de instituciones y las imágenes/enlaces de proyectos se preservan mediante IDs estables en el adaptador. Para agregar imágenes a proyectos nuevos, ampliar esos mapas. No hace falta cambiar los componentes del sitio.

Para vista local: `pnpm dev --port 4181 --hostname 127.0.0.1`. El guardado en el gestor actualiza el contenido local; actualizar el sitio en internet requiere reconstruir y desplegar esta instantánea. La conexión actual no hace commits, pushes ni despliegues automáticos.

Validación: `pnpm typecheck`, `pnpm lint`, `pnpm test` y `PORTFOLIO_TEST_URL=http://127.0.0.1:4181 pnpm test:e2e`. En PowerShell asignar primero `$env:PORTFOLIO_TEST_URL`. Los tests de navegador usan Chrome instalado y no inician otro servidor cuando se proporciona esa URL.


## Contenido propio administrado

El catálogo público incluye `site` por idioma: presentación, visibilidad, extensiones de trayectoria, casos de trabajo vinculados o exclusivos, imágenes, enlaces, favoritos y metadatos SEO. `site: null` indica que los textos propios esperan traducción; no invalida por sí solo el PDF del CV. El editor privado guarda y valida estos datos antes de proyectarlos aquí.

Los favoritos también tienen rutas `/[locale]/perfil/[profile]/fav`. Los enlaces históricos a PDFs resuelven mediante `/api/cv/[format]` la instantánea vigente, sin almacenar una redirección permanente. Publicar desde GestionCV valida el proyecto y sube el catálogo, las imágenes administradas y los PDFs a main, activando Vercel. El administrador sigue siendo local.
