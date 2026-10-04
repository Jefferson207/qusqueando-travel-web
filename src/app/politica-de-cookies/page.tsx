import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/lib/legal";

export const metadata = pageMetadata({
  path: "/politica-de-cookies",
  title: "Política de Cookies",
  description: legalPages.cookies.description,
});

export default function CookiesPage() {
  return <LegalPage {...legalPages.cookies} />;
}
