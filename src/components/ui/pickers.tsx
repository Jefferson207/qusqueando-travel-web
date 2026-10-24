import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { COUNTRIES, OTHER_COUNTRY, cleanPhone, flag, joinPhone, phoneHint, splitPhone, validPhone } from "@/lib/fields";
import { isoDate, parseDate, startOfToday } from "@/lib/trip";
import { cn } from "@/lib/utils";

/** Cierra un panel al hacer clic fuera o pulsar Escape. */
export function useDismiss<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const down = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [onClose]);
  return ref;
}

/** Panel flotante con animación de entrada. */
export function Popover({ open, className, children }: { open: boolean; className?: string; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={cn(
            "absolute z-50 mt-2 origin-top rounded-2xl border border-[#efe2c8] bg-white p-2 text-[#021623] shadow-[0_24px_60px_rgba(2,22,35,0.22)]",
            className,
          )}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export type SelectOption = { value: string; label: string; hint?: string; image?: string };

/**
 * Selector desplegable moderno (reemplaza al <select> nativo).
 * Controlado con value/onChange, o libre con defaultValue + name para formularios.
 */
export function Select({
  value,
  defaultValue = "",
  onChange,
  options,
  placeholder = "Seleccionar",
  name,
  required,
  className,
  buttonClassName,
  "aria-label": ariaLabel,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  name?: string;
  required?: boolean;
  className?: string;
  buttonClassName?: string;
  "aria-label"?: string;
}) {
  const items: SelectOption[] = options.map((option) => (typeof option === "string" ? { value: option, label: option } : option));
  const [own, setOwn] = useState(defaultValue);
  const current = value ?? own;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useDismiss<HTMLDivElement>(() => setOpen(false));
  const listId = useId();
  const selected = items.find((item) => item.value === current);

  function choose(item: SelectOption) {
    if (value === undefined) setOwn(item.value);
    onChange?.(item.value);
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setActive(Math.max(0, items.findIndex((item) => item.value === current)));
      setOpen(true);
      return;
    }
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(items.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (items[active]) choose(items[active]);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => {
          setActive(Math.max(0, items.findIndex((item) => item.value === current)));
          setOpen((state) => !state);
        }}
        onKeyDown={onKeyDown}
        className={cn(
          "field flex items-center justify-between gap-2 text-left",
          open && "border-[#d4952a] shadow-[0_0_0_2px_rgb(212_149_42_/_20%)]",
          buttonClassName,
        )}
      >
        <span className={cn("truncate", !selected && "text-[#98a2b3]")}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-[#b97a0b] transition-transform duration-200", open && "rotate-180")} />
      </button>
      {name ? (
        // Campo oculto para formularios; el «required» se valida con un input enfocable invisible.
        <input
          tabIndex={-1}
          aria-hidden="true"
          name={name}
          value={current}
          required={required}
          onChange={() => undefined}
          className="pointer-events-none absolute bottom-0 left-1/2 h-px w-px opacity-0"
        />
      ) : null}
      <Popover open={open} className="left-0 right-0 max-h-72 min-w-full overflow-y-auto">
        <ul id={listId} role="listbox">
          {items.map((item, index) => {
            const isSelected = item.value === current;
            return (
              <li key={item.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(item)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                    index === active ? "bg-[#fbf3e3]" : "hover:bg-[#fbf3e3]",
                    isSelected && "font-semibold text-[#8a5a08]",
                  )}
                >
                  {item.image ? <img src={item.image} alt="" className="h-9 w-12 shrink-0 rounded-lg object-cover" /> : null}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{item.label}</span>
                    {item.hint ? <span className="block text-xs font-normal text-[#98a2b3]">{item.hint}</span> : null}
                  </span>
                  {isSelected ? <Check className="h-4 w-4 shrink-0 text-[#d4952a]" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </Popover>
    </div>
  );
}

/** Calendario mensual (lunes a domingo) que no permite fechas pasadas. */
export function Calendar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const today = startOfToday();
  const [view, setView] = useState(() => {
    const base = value ? parseDate(value) : today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const offset = (view.getDay() + 6) % 7;
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const canGoBack = view > new Date(today.getFullYear(), today.getMonth(), 1);
  const move = (n: number) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));

  return (
    <div className="w-full select-none p-1">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" onClick={() => move(-1)} disabled={!canGoBack} aria-label="Mes anterior" className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-[#fbf3e3] disabled:opacity-30">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <b className="text-sm capitalize">{view.toLocaleDateString("es-PE", { month: "long", year: "numeric" })}</b>
        <button type="button" onClick={() => move(1)} aria-label="Mes siguiente" className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-[#fbf3e3]">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
          <span key={i} className="py-1 text-[11px] font-bold uppercase text-[#98a2b3]">{day}</span>
        ))}
        {Array.from({ length: offset }, (_, i) => <span key={`vacio-${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const date = new Date(view.getFullYear(), view.getMonth(), i + 1);
          const iso = isoDate(date);
          const selected = iso === value;
          return (
            <button
              type="button"
              key={iso}
              disabled={date < today}
              onClick={() => onChange(iso)}
              className={cn(
                "grid aspect-square place-items-center rounded-full text-sm transition disabled:cursor-not-allowed disabled:text-[#d0d5dd]",
                selected ? "bg-[#d4952a] font-bold text-white shadow-[0_6px_14px_rgba(212,149,42,.4)]" : "hover:bg-[#fbf3e3]",
                iso === isoDate(today) && !selected && "font-bold text-[#b97a0b] ring-1 ring-[#e9c98a]",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Contador con botones − y +. */
export function Counter({ label, hint, value, min, max, onChange }: { label: string; hint: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const button = "grid h-9 w-9 place-items-center rounded-full border border-[#e4d5b8] text-[#8a5a08] transition hover:border-[#d4952a] hover:bg-[#fbf3e3] disabled:opacity-30";
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl px-3 py-3">
      <div>
        <b className="block text-sm text-[#021623]">{label}</b>
        <small className="text-xs text-[#98a2b3]">{hint}</small>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" aria-label={`Quitar ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className={button}>
          <Minus className="h-4 w-4" />
        </button>
        <motion.span key={value} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-5 text-center font-bold">
          {value}
        </motion.span>
        <button type="button" aria-label={`Agregar ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className={button}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Teléfono con selector de país: guarda «+51 987654321». */
export function PhoneField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [iso, setIso] = useState(() => splitPhone(value).iso);
  const parts = splitPhone(value, iso);
  const number = parts.iso === iso ? parts.number : "";
  const other = iso === OTHER_COUNTRY;
  const invalid = !!value && !validPhone(value);
  const options: SelectOption[] = [
    ...COUNTRIES.map((c) => ({ value: c.iso, label: `${flag(c.iso)} +${c.code}`, hint: c.name })),
    { value: OTHER_COUNTRY, label: "🌐 Otro", hint: "Otro país" },
  ];

  return (
    <div>
      <div className="flex gap-2">
        <Select
          aria-label="País del teléfono"
          value={iso}
          options={options}
          className="w-32 shrink-0"
          onChange={(next) => {
            setIso(next);
            onChange(next === OTHER_COUNTRY ? (number ? `+${number}` : "") : joinPhone(next, number.replace(/^\+/, "")));
          }}
        />
        <input
          type="tel"
          inputMode={other ? "tel" : "numeric"}
          autoComplete="tel-national"
          aria-invalid={invalid}
          placeholder={other ? "+44 7911123456" : iso === "PE" ? "987654321" : "Número"}
          value={number}
          onChange={(event) => {
            const cleaned = cleanPhone(event.target.value, other);
            onChange(other ? cleaned : joinPhone(iso, cleaned));
          }}
          className={cn("field", invalid && "border-red-300")}
        />
      </div>
      {invalid ? <small className="mt-1 block text-xs text-red-600">{phoneHint(iso)}</small> : null}
    </div>
  );
}
