import { useSeo } from "@/components/seo";
import { pageMetadata } from "@/lib/seo";
import { ClaimsForm, ClaimsHeader } from "@/components/claims-form";
import { useSiteConfig } from "@/components/site-config-provider";

const seo = pageMetadata({
  path: "/libro-de-reclamaciones",
  title: "Libro de Reclamaciones",
  description: "Formulario virtual del Libro de Reclamaciones de Qusqueando Travel.",
});

export default function ClaimsBookPage() {
  useSeo(seo);
  const siteConfig = useSiteConfig();

  return (
    <section className="bg-[#faf2e6] py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ClaimsHeader siteName={siteConfig.name} />
        <ClaimsForm siteConfig={siteConfig} />
      </div>
    </section>
  );
}
