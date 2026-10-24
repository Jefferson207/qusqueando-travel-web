import { LegalPage } from "@/components/legal/legal-page";
import { useSeo } from "@/components/seo";
import { legalPages } from "@/lib/legal";

export const legalRoutes = {
  "/politica-de-privacidad": legalPages.privacy,
  "/politica-de-proteccion-de-datos-personales": legalPages.personalData,
  "/terminos-y-condiciones": legalPages.terms,
  "/medios-de-pago": legalPages.payments,
  "/politica-de-cookies": legalPages.cookies,
};

export default function LegalRoute({ path }: { path: keyof typeof legalRoutes }) {
  const document = legalRoutes[path];
  useSeo({ path, title: document.title, description: document.description });
  return <LegalPage {...document} />;
}
