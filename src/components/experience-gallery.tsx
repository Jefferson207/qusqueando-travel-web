import Image from "@/components/image";
import { useState } from "react";
import { X } from "lucide-react";

export function ExperienceGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const main = images[0];

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <button
          type="button"
          onClick={() => setActive(main)}
          className="group relative min-h-[360px] overflow-hidden rounded-[28px] shadow-[0_24px_70px_rgba(2,22,35,0.16)] sm:min-h-[540px]"
        >
          <Image
            src={main}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#021623]/35 to-transparent opacity-70" />
        </button>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {images.slice(1, 3).map((image, index) => (
            <button
              type="button"
              key={image}
              onClick={() => setActive(image)}
              className="group relative min-h-[240px] overflow-hidden rounded-[24px] shadow-[0_18px_48px_rgba(2,22,35,0.12)]"
            >
              <Image
                src={image}
                alt={`${title} galería ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 35vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            type="button"
            key={image}
            onClick={() => setActive(image)}
            className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border border-white bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Image src={image} alt={`${title} miniatura ${index + 1}`} fill sizes="112px" className="object-cover" />
          </button>
        ))}
      </div>

      {active ? (
        <div className="fixed inset-0 z-[80] bg-[#021623]/90 p-4 backdrop-blur-sm" role="dialog">
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#021623] shadow-lg transition hover:scale-105"
            aria-label="Cerrar galería"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mx-auto flex h-full max-w-6xl items-center justify-center">
            <div className="relative h-[82vh] w-full overflow-hidden rounded-[28px]">
              <Image src={active} alt={title} fill sizes="100vw" className="object-contain" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
