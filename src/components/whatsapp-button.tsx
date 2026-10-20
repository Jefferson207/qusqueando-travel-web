"use client";

import { MessageCircle } from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
import { useSiteConfig } from "@/components/site-config-provider";
import { whatsappUrl } from "@/lib/site";

export function WhatsAppButton({
  experienceName,
  className,
}: {
  experienceName?: string;
  className?: string;
}) {
  const siteConfig = useSiteConfig();

  return (
    <a href={whatsappUrl(siteConfig.whatsapp, experienceName)} target="_blank" rel="noreferrer" className={buttonClassName("primary", className)}>
      <MessageCircle className="h-4 w-4" />
      Reservar por WhatsApp
    </a>
  );
}
