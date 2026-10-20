import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/lib/legal";

export const metadata = pageMetadata({
  path: "/afiche-esnna-mincetur",
  title: "Afiche ESNNA MINCETUR",
  description: legalPages.esnna.description,
});

export default function EsnnaPage() {
  return (
    <>
      <LegalPage {...legalPages.esnna} />
      <section className="-mt-12 bg-[#f6f7f9] pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="surface-card p-3">
            <Image
              src="/esnna.png"
              alt="Afiche ESNNA MINCETUR"
              width={1054}
              height={1492}
              className="surface-content h-auto w-full rounded-2xl"
              priority
            />
          </div>
        </div>
      </section>
    </>
  );
}
