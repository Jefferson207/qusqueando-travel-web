# Qusqueando Travel

Sitio web React + Vite + TypeScript (Tailwind CSS) con panel de administración en `/admin`.

## Ejecutar

```bash
npm install
npm run dev
```

`npm run dev` sirve la web y también las funciones de `api/` (las mismas que usa Vercel), así que el panel funciona en local. Copia `.env.example` a `.env` y completa las variables.

## Estructura

- `src/pages/` — páginas públicas y del panel (`src/pages/admin/`).
- `src/components/` — componentes de la web y del panel.
- `src/lib/` — datos iniciales, configuración, textos legales y SEO.
- `api/` — funciones serverless de Vercel: catálogo público, login, paquetes, categorías, configuración, subida de imágenes (cPanel) y `sitemap.xml`.

Los datos se guardan en Upstash Redis bajo el prefijo `CATALOG_KEY`. El sitio muestra al instante lo último guardado en el navegador y luego lo actualiza con `/api/catalog`.
