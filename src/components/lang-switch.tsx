import { motion } from "framer-motion";
import { currentLang, languages, setLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Botones ES / EN / IT. «notranslate» evita que Google traduzca los propios botones. */
export function LangSwitch({ dark = false, className }: { dark?: boolean; className?: string }) {
  const lang = currentLang();
  return (
    <div
      translate="no"
      role="group"
      aria-label="Idioma / Language / Lingua"
      className={cn(
        "notranslate relative inline-flex rounded-full border p-1 text-xs font-bold",
        dark ? "border-white/30 bg-white/10 backdrop-blur" : "border-[#e9c98a] bg-white",
        className,
      )}
    >
      {languages.map((item) => {
        const active = item.code === lang;
        return (
          <button
            key={item.code}
            type="button"
            title={item.name}
            aria-pressed={active}
            onClick={() => setLang(item.code)}
            className={cn(
              "relative z-10 h-8 w-9 rounded-full transition-colors",
              active ? "text-[#021623]" : dark ? "text-white/80 hover:text-white" : "text-[#667085] hover:text-[#021623]",
            )}
          >
            {active ? <motion.span layoutId="lang-activo" className="absolute inset-0 -z-10 rounded-full bg-[#d4952a]" /> : null}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
