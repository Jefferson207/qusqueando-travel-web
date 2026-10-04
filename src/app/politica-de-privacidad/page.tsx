import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/lib/legal";

export const metadata = pageMetadata({
  path: "/politica-de-privacidad",
  title: "Política de Privacidad",
  description: legalPages.privacy.description,
});

export default function PrivacyPage() {
  return <LegalPage {...legalPages.privacy} />;
}
