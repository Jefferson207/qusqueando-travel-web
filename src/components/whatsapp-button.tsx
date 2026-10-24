import { MessageCircle } from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
import { useSiteConfig } from "@/components/site-config-provider";
import { whatsappUrl } from "@/lib/site";

export function WhatsAppButton({
  experienceName,
  experienceSlug,
  className,
}: {
  experienceName?: string;
  experienceSlug?: string;
  className?: string;
}) {
  const siteConfig = useSiteConfig();

  return (
    <a href={whatsappUrl(siteConfig.whatsapp, experienceName, experienceSlug)} target="_blank" rel="noreferrer" className={buttonClassName("primary", className)}>
      <MessageCircle className="h-4 w-4" />
      Reservar por WhatsApp
    </a>
  );
}
