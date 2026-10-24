import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import { defaultCatalog, SiteConfigProvider, type Catalog } from "@/components/site-config-provider";
import { startTranslation } from "@/lib/i18n";
import { loadRates } from "@/lib/money";
import "@/styles.css";

const root = createRoot(document.getElementById("root")!);
const CACHE = "qusqueando-catalogo";
const cache = {
  get: () => {
    try {
      return localStorage.getItem(CACHE);
    } catch {
      return null;
    }
  },
  set: (value: string) => {
    try {
      localStorage.setItem(CACHE, value);
    } catch {
      // sin almacenamiento
    }
  },
};
const valid = (value: unknown): value is Catalog =>
  !!value && Array.isArray((value as Catalog).experiences) && Array.isArray((value as Catalog).categories) && !!(value as Catalog).config;

function render(catalog: Catalog) {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <SiteConfigProvider catalog={catalog}>
          <App />
        </SiteConfigProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}

/** Trae el contenido publicado desde /admin. Sin conexión devuelve null. */
async function fetchCatalog(timeout: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch("/api/catalog", { signal: controller.signal });
    const data = response.ok ? await response.json() : null;
    return valid(data) ? JSON.stringify(data) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Se muestra al instante lo último guardado en el navegador y luego se
// actualiza con lo publicado. La primera visita espera un momento al servidor
// y, si no responde, usa el contenido inicial de src/lib/data.ts.
async function start() {
  // El panel siempre va en español y con los precios originales.
  if (!location.pathname.startsWith("/admin")) {
    startTranslation();
    await loadRates();
  }
  let saved = cache.get();
  try {
    if (!saved || !valid(JSON.parse(saved))) saved = null;
  } catch {
    saved = null;
  }

  if (saved) {
    render(JSON.parse(saved));
    const fresh = await fetchCatalog(8000);
    if (fresh && fresh !== saved) {
      cache.set(fresh);
      render(JSON.parse(fresh));
    }
    return;
  }

  const fresh = await fetchCatalog(4000);
  if (fresh) cache.set(fresh);
  render(fresh ? JSON.parse(fresh) : defaultCatalog);
}

void start();
