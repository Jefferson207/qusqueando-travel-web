import { useSeo } from "@/components/seo";
import Link from "@/components/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { buttonClassName } from "@/components/ui/button";

export default function NotFound() {
  useSeo({ path: "/404", title: "Página no encontrada", description: "La página que buscas no está disponible o fue movida.", noindex: true });
  return (
    <>
      <PageHero
        image="/images/hero-machu-picchu-dorado.jpg"
        eyebrow="Error 404"
        title="Este camino"
        accent="no existe"
        description="La página que buscas no está disponible o fue movida. Te invitamos a seguir explorando."
      >
        <Link href="/experiencias" className={buttonClassName("primary", "mt-8 h-12 px-7")}>
          Ver experiencias <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>
      <div className="h-16 bg-[#fbf6ea]" />
    </>
  );
}
