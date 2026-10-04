import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/lib/legal";

export const metadata = pageMetadata({
  path: "/politica-de-proteccion-de-datos-personales",
  title: "Política de Protección de Datos Personales",
  description: legalPages.personalData.description,
});

export default function PersonalDataPage() {
  return <LegalPage {...legalPages.personalData} />;
}
