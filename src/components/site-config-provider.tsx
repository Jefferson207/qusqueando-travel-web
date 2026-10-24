import { createContext, useContext } from "react";
import { categories as seedCategories, experiences as seedExperiences, type Category, type Experience } from "@/lib/data";
import { siteConfig as defaultSiteConfig, type SiteConfig } from "@/lib/site";

export type Catalog = {
  /** Paquetes publicados (status ACTIVE). */
  experiences: Experience[];
  categories: Category[];
  config: SiteConfig;
};

export const defaultCatalog: Catalog = {
  experiences: seedExperiences.filter((experience) => experience.status === "ACTIVE"),
  categories: seedCategories,
  config: defaultSiteConfig,
};

const CatalogContext = createContext<Catalog>(defaultCatalog);

export function SiteConfigProvider({
  catalog,
  children,
}: {
  catalog: Catalog;
  children: React.ReactNode;
}) {
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}

export function useSiteConfig() {
  return useContext(CatalogContext).config;
}
