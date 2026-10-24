import { createContext, useContext, useState } from "react";
import type { Category, Experience } from "@/lib/data";
import type { SiteConfig } from "@/lib/site";

export type AdminData = { experiences: Experience[]; categories: Category[]; config: SiteConfig };

type AdminContextValue = AdminData & {
  /** Vuelve a leer todo el contenido desde el servidor. */
  reload: () => Promise<void>;
  logout: () => void;
};

export const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error("useAdmin debe usarse dentro del panel.");
  return value;
}

// Datos del formulario de paquetes tal como los espera la API (la casilla "featured" llega como "on").
export function experienceValues(values: Record<string, string>) {
  const list = (key: string) => {
    try {
      return JSON.parse(values[key] || "[]");
    } catch {
      return [];
    }
  };
  return {
    ...values,
    featured: values.featured === "on",
    includes: list("includes"),
    excludes: list("excludes"),
    itinerary: list("itinerary"),
    faqs: list("faqs"),
  };
}

/** Mensaje de error entendible para mostrar en el panel. */
export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "No se pudo completar la acción. Inténtalo de nuevo.";
}

/**
 * Envío de los formularios del panel: lee los campos (FormData) y ejecuta
 * `save`. Si falla, muestra el mensaje del servidor arriba de la página.
 */
export function useAdminForm(save: (values: Record<string, string>) => Promise<void>) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(
      [...new FormData(event.currentTarget)].map(([key, value]) => [key, String(value)]),
    );
    setError("");
    setSaving(true);
    try {
      await save(values);
    } catch (saveError) {
      setError(errorMessage(saveError));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  }

  return { error, saving, onSubmit };
}
