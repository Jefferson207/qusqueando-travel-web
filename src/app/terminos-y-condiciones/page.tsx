import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/lib/legal";

export const metadata = pageMetadata({
  path: "/terminos-y-condiciones",
  title: "Términos y Condiciones",
  description: legalPages.terms.description,
});

export default function TermsPage() {
  return <LegalPage {...legalPages.terms} />;
}
