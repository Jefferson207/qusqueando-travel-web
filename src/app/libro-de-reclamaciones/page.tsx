import { pageMetadata } from "@/lib/seo";
import { ClaimsForm, ClaimsHeader } from "@/components/claims-form";
import { getSiteConfig } from "@/lib/store";

export const metadata = pageMetadata({
  path: "/libro-de-reclamaciones",
  title: "Libro de Reclamaciones",
  description: "Formulario virtual del Libro de Reclamaciones de Qusqueando Travel.",
});

export const dynamic = "force-dynamic";

export default async function ClaimsBookPage() {
  const siteConfig = await getSiteConfig();

  return (
    <section className="bg-[#faf2e6] py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ClaimsHeader siteName={siteConfig.name} />
        <ClaimsForm siteConfig={siteConfig} />
      </div>
    </section>
  );
}
