"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

// Abre el afiche ESNNA en un modal. Sin JavaScript (o con Ctrl/Cmd+clic)
// el enlace sigue llevando a /afiche-esnna-mincetur.
export function EsnnaModalLink({ className, label }: { className?: string; label: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function open(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <Link href="/afiche-esnna-mincetur" className={className} onClick={open} aria-haspopup="dialog">
        {label}
      </Link>
      <dialog
        ref={dialogRef}
        aria-label="Afiche ESNNA MINCETUR"
        onClick={(event) => {
          // Clic en el fondo oscuro (fuera del contenido) cierra el modal.
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto max-h-[92vh] w-[min(92vw,560px)] overflow-visible bg-transparent p-0 backdrop:bg-[#021623]/80 backdrop:backdrop-blur-sm"
      >
        <div className="relative rounded-2xl bg-white p-2 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar afiche"
            className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#d4952a] text-[#021623] shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X className="h-5 w-5" />
          </button>
          <Image
            src="/esnna.png"
            alt="Afiche ESNNA MINCETUR: prevención de la explotación sexual de niñas, niños y adolescentes en el turismo"
            width={1054}
            height={1492}
            sizes="(min-width: 640px) 560px, 92vw"
            className="h-auto max-h-[calc(92vh-1rem)] w-full rounded-xl object-contain"
          />
        </div>
      </dialog>
    </>
  );
}
