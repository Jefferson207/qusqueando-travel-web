import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/lib/legal";

export const metadata = pageMetadata({
  path: "/medios-de-pago",
  title: "Medios de Pago",
  description: legalPages.payments.description,
});

export default function PaymentsPage() {
  return <LegalPage {...legalPages.payments} />;
}
