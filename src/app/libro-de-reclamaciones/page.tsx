import { pageMetadata } from "@/lib/seo";
import { ClaimsForm, ClaimsHeader } from "@/components/claims-form";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/libro-de-reclamaciones",
  title: "Libro de Reclamaciones",
  description: "Formulario virtual del Libro de Reclamaciones de Qusqueando Travel.",
});

export default function ClaimsBookPage() {
  return (
    <section className="bg-[#f6f3ed] py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ClaimsHeader siteName={siteConfig.name} />
        <ClaimsForm siteConfig={siteConfig} />
      </div>
    </section>
  );
}
