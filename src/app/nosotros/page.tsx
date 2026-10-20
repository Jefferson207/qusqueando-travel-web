import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { Compass, Eye, Sparkles } from "lucide-react";

export const metadata = pageMetadata({
  path: "/nosotros",
  title: "Nosotros",
  description: "Historia, misión y visión de Qusqueando Travel.",
});

const blocks = [
  {
    title: "Historia",
    icon: Compass,
    content:
      "Qusqueando Travel nació con el propósito de acercar a viajeros nacionales y extranjeros a la cosmovisión andina mediante experiencias que integran conocimiento ancestral, observación del cielo y exploración de sitios arqueológicos.",
  },
  {
    title: "Misión",
    icon: Sparkles,
    content:
      "Ofrecer experiencias auténticas que conecten a las personas con la cultura andina, el patrimonio arqueológico y la observación de fenómenos astronómicos, promoviendo un turismo responsable y de calidad.",
  },
  {
    title: "Visión",
    icon: Eye,
    content: "Ser una agencia líder en turismo arqueoastronómico en el Perú.",
  },
];

export default function AboutPage() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
        <div>
          <p className="eyebrow">Nosotros</p>
          <h1 className="mt-3 text-4xl font-bold text-[#021623] sm:text-5xl">
            Turismo cultural con mirada andina y servicio premium.
          </h1>
          <div className="mt-8 grid gap-4 text-[#475467]">
            {blocks.map((block) => {
              const Icon = block.icon;

              return (
                <section key={block.title} className="surface-card surface-hover p-5">
                  <div className="surface-content flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fdf0dc] text-[#8a5a08]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-[#021623]">{block.title}</h2>
                      <p className="mt-3 leading-7">{block.content}</p>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
        <div className="surface-card min-h-[420px] p-3">
          <div className="surface-content relative h-full min-h-[396px] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1400&auto=format&fit=crop"
              alt="Paisaje arqueológico andino"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
