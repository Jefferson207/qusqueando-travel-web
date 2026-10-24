import { useEffect } from "react";
import { toWhatsappWebUrl } from "@/lib/site";

function isDesktop() {
  return (
    window.matchMedia("(pointer: fine)").matches &&
    !/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  );
}

// En computadoras, los enlaces de WhatsApp abren directo WhatsApp Web, sin la
// página intermedia ni el aviso de "¿Abrir WhatsApp?". En celulares se deja el
// enlace normal para que abra la app.
export function WhatsappDesktopLinks() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const webUrl = toWhatsappWebUrl(anchor.href);
      if (!webUrl || !isDesktop()) return;

      event.preventDefault();
      window.open(webUrl, "_blank", "noopener,noreferrer");
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
