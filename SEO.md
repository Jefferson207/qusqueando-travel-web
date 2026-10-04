# SEO de Qusqueando Travel

Configuración principal: `src/lib/seo.ts`. Sigue la base de Discoma365, adaptada a Next.js: títulos, descripciones, canónicas, Open Graph, Twitter, identidad de la agencia y fichas individuales de experiencias.

Cada página pública declara su ruta y metadatos con `pageMetadata`. Las experiencias usan los títulos y descripciones editables del administrador y su imagen principal. Se evita duplicar «Qusqueando Travel» cuando el título guardado ya incluye la marca. Sus datos estructurados usan ItemPage y BreadcrumbList, sin inventar reseñas ni valoraciones.

`src/app/layout.tsx` incluye TravelAgency y WebSite. `src/app/sitemap.ts` publica las once rutas generales y las experiencias ACTIVE; no incluye borradores ni fechas de modificación ficticias. El sitemap se obtiene dinámicamente para reflejar el catálogo. Los borradores tienen noindex y no reciben canónica ni marcado de ficha. La administración conserva noindex; robots permite rastrearla para leer esa etiqueta y excluye las API.

Solo se modificó SEO. El diseño, formularios, navegación y administración mantienen su comportamiento.

## Validación

```bash
npm run build
node node_modules/next/dist/bin/next start --port 3018
```

En otra terminal: `npm run check:seo`.

El dominio conservado del proyecto es `https://qusqueandotravel.com`. La comprobación desde este entorno no pudo resolver su DNS; confirmar el dominio operativo antes de publicar. Si cambia, actualizar `siteUrl` en `src/lib/seo.ts` y recompilar. No se ha desplegado el sitio.

Después del despliegue habitual en un alojamiento Next.js, enviar `https://qusqueandotravel.com/sitemap.xml` a Search Console e inspeccionar las páginas principales. Los enlaces de sitio y las posiciones los decide Google; no se garantiza el formato de resultados de Discoma365.

Referencias: https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata y https://developers.google.com/search/docs/appearance/sitelinks?hl=es.

El AGENTS.md remite a `node_modules/next/dist/docs/`, ausente en esta instalación. Se consultó la documentación oficial de Next.js 15 para la API de metadatos.
