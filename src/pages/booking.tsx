import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock, MapPin, Send, ShieldCheck, Users, X } from "lucide-react";
import Link from "@/components/link";
import { useSeo } from "@/components/seo";
import { useCatalog } from "@/components/site-config-provider";
import { buttonClassName } from "@/components/ui/button";
import { Calendar, Counter, PhoneField, Select } from "@/components/ui/pickers";
import type { Experience } from "@/lib/data";
import { COUNTRIES, EMAIL_HINT, validEmail, validPhone } from "@/lib/fields";
import { siteDomain, toWhatsappWebUrl, whatsappMessageUrl } from "@/lib/site";
import { cartSlugs, clearCart, formatDate, personsLabel, replaceCart, travelersLabel, tripTotals, useTripParams } from "@/lib/trip";
import { money, PRICE_ON_REQUEST } from "@/lib/money";
import { cn, formatCurrency } from "@/lib/utils";

const steps = ["Experiencia", "Fecha y viajeros", "Tus datos", "Confirmar"];
const countryOptions = [...COUNTRIES.map((c) => c.name), "Otro"];

type Form = { name: string; email: string; phone: string; country: string; notes: string };

/** Precio original y, si la web está en inglés o italiano, el convertido entre paréntesis. */
const both = (amount: number, currency: string) => {
  const original = formatCurrency(amount, currency);
  const shown = money(amount, currency);
  return shown === original ? original : `${original} (${shown})`;
};

/** Mensaje de reserva con formato de WhatsApp (*negrita*, _cursiva_ y emojis). */
function bookingMessage(code: string, items: Experience[], date: string, adults: number, kids: number, form: Form) {
  const line = "━━━━━━━━━━━━━━";
  const people = adults + kids;
  const total = tripTotals(items, people);
  return [
    "🌄 *NUEVA SOLICITUD DE RESERVA*",
    line,
    "¡Hola, *Qusqueando Travel*! 👋",
    `Quiero reservar ${items.length === 1 ? "esta experiencia" : "estas experiencias"}:`,
    "",
    `🎒 *Experiencia${items.length !== 1 ? "s" : ""} (${items.length}):*`,
    ...items.flatMap((item, i) => [
      `${i + 1}. *${item.name}*`,
      `   📍 ${item.location} · ⏳ ${item.duration}`,
      item.priceFrom
        ? `   💰 ${both(item.priceFrom, item.currency)} x ${personsLabel(people)} = *${both(item.priceFrom * people, item.currency)}*`
        : "   💰 Precio a confirmar",
    ]),
    "",
    ...(total ? [`💵 *Total referencial:* ${total}`, ""] : []),
    `📅 *Fecha de inicio:* ${formatDate(date, true)}`,
    `👥 *Viajeros:* ${travelersLabel(adults, kids)}`,
    "",
    line,
    "👤 *MIS DATOS DE CONTACTO*",
    `• *Nombre:* ${form.name.trim()}`,
    `• *Correo:* ${form.email.trim()}`,
    `• *WhatsApp:* ${form.phone.trim()}`,
    `• *País:* ${form.country.trim() || "—"}`,
    ...(form.notes.trim() ? ["", "📝 *Comentarios:*", form.notes.trim()] : []),
    "",
    line,
    `🔖 *Código de solicitud:* ${code}`,
    "",
    "✅ Quedo atento/a a la confirmación de *disponibilidad* y *precio final*.",
    "",
    `🌐 _Mensaje enviado desde la web ${siteDomain}_`,
  ].join("\n");
}

/** En PC abre WhatsApp Web directo; en el celular, la app. */
function openWhatsapp(phone: string, message: string) {
  const href = whatsappMessageUrl(phone, message);
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  window.open(mobile ? href : (toWhatsappWebUrl(href) ?? href), "_blank");
}

export default function BookingPage() {
  useSeo({ path: "/reservar", title: "Reserva tu experiencia", description: "Reserva tus experiencias en Cusco con Qusqueando Travel en 4 pasos.", noindex: true });
  const { experiences, categories, config } = useCatalog();
  const { slug: initialSlug } = useParams();
  const [params] = useSearchParams();
  const trip = useTripParams();

  const [slugs, setSlugs] = useState<string[]>(() =>
    params.get("carrito") === "1"
      ? cartSlugs()
      : initialSlug && experiences.some((item) => item.slug === initialSlug)
        ? [...new Set([initialSlug, ...cartSlugs()])]
        : cartSlugs(),
  );
  const [step, setStep] = useState(() => (slugs.length ? 1 : 0));
  const [date, setDate] = useState(trip.date);
  const [adults, setAdults] = useState(trip.adults);
  const [kids, setKids] = useState(trip.kids);
  const [form, setForm] = useState<Form>({ name: "", email: "", phone: "", country: "Perú", notes: "" });
  const [accept, setAccept] = useState(false);
  const [code, setCode] = useState("");
  const [emailed, setEmailed] = useState(false);
  const [filter, setFilter] = useState(trip.destination);

  const selected = slugs.map((slug) => experiences.find((item) => item.slug === slug)).filter((item): item is Experience => !!item);
  const main = selected[0];
  const people = adults + kids;
  const total = tripTotals(selected, people);
  const options = useMemo(() => experiences.filter((item) => !filter || item.category === filter), [experiences, filter]);
  const usedCategories = categories.filter((category) => experiences.some((item) => item.category === category.name));

  useEffect(() => replaceCart(slugs), [slugs]);

  const toggle = (slug: string) => setSlugs((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]));
  const valid = [selected.length > 0, !!date, !!form.name.trim() && validEmail(form.email) && validPhone(form.phone), accept][step];
  const badEmail = !!form.email && !validEmail(form.email);
  const go = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function confirm() {
    if (!selected.length || !accept) return;
    const newCode = `QT-${Date.now().toString(36).slice(-6).toUpperCase()}`;
    openWhatsapp(config.whatsapp, bookingMessage(newCode, selected, date, adults, kids, form));
    setCode(newCode);
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Además del WhatsApp: se guarda en el panel y se avisa por correo (si está configurado).
    fetch("/api/booking", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: newCode,
        experiences: selected.map((item) => ({ slug: item.slug, name: item.name, location: item.location, duration: item.duration, price: item.priceFrom, currency: item.currency })),
        date,
        adults,
        kids,
        ...form,
      }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { code?: string; emailed?: boolean } | null) => {
        if (data?.code) setCode(data.code);
        if (data?.emailed) setEmailed(true);
      })
      .catch(() => undefined);
  }

  if (code && selected.length) {
    return (
      <section className="bg-[#fbf6ea] px-4 pb-20 pt-12 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl rounded-3xl border border-[#efe2c8] bg-white p-8 text-center shadow-[0_30px_70px_rgba(2,22,35,.1)] sm:p-12">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.15 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#d4952a] text-white shadow-[0_14px_30px_rgba(212,149,42,.45)]">
            <Check className="h-8 w-8" />
          </motion.span>
          <p className="eyebrow mt-6">Solicitud enviada</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-[#021623]">¡Gracias, {form.name.trim().split(" ")[0]}!</h1>
          <p className="mx-auto mt-4 max-w-lg leading-7 text-[#475467]">
            Recibimos tu solicitud para <b>{selected.map((item) => item.name).join(", ")}</b>. Te contactaremos por WhatsApp o correo para confirmar disponibilidad, precio final y forma de pago.
            {emailed ? <> También te enviamos un resumen a <b>{form.email}</b>.</> : null}
          </p>
          <div className="mx-auto mt-6 inline-flex flex-col rounded-2xl border-2 border-dashed border-[#e9c98a] bg-[#fdf6e7] px-8 py-4">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#98a2b3]">Código de solicitud</span>
            <b className="mt-1 text-2xl tracking-widest text-[#b97a0b]">{code}</b>
          </div>
          <ul className="mx-auto mt-6 grid max-w-sm gap-2 text-left text-sm text-[#475467]">
            <li className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#b97a0b]" /> {formatDate(date, true)}</li>
            <li className="flex items-center gap-2"><Users className="h-4 w-4 text-[#b97a0b]" /> {travelersLabel(adults, kids)}</li>
            {total ? <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#b97a0b]" /> Total referencial <b className="text-[#021623]">{total}</b></li> : null}
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/experiencias" className={buttonClassName("primary", "h-12 px-6")}>Ver más experiencias <ChevronRight className="h-4 w-4" /></Link>
            <Link href="/" className={buttonClassName("outline", "h-12 px-6")}>Volver al inicio</Link>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="bg-[#fbf6ea] px-4 pb-20 pt-10 sm:px-8 sm:pt-14">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow text-center">Reserva en 4 pasos</p>
        <h1 className="mt-2 text-center font-display text-4xl font-bold text-[#021623] sm:text-5xl">Arma tu <span className="text-[#cf8d16]">viaje a Cusco</span></h1>

        {/* Pasos */}
        <ol className="mx-auto mt-8 flex max-w-3xl items-center">
          {steps.map((label, i) => (
            <li key={label} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
              <button type="button" disabled={i > step} onClick={() => go(i)} className="group flex items-center gap-2 disabled:cursor-default">
                <span className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-bold transition",
                  i < step ? "border-[#d4952a] bg-[#d4952a] text-white" : i === step ? "border-[#d4952a] bg-white text-[#b97a0b] shadow-[0_0_0_4px_rgba(212,149,42,.18)]" : "border-[#e4d5b8] bg-white text-[#98a2b3]",
                )}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span className={cn("hidden text-sm font-semibold md:block", i <= step ? "text-[#021623]" : "text-[#98a2b3]")}>{label}</span>
              </button>
              {i < steps.length - 1 ? (
                <span className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-[#eaddc4]">
                  <motion.span className="block h-full bg-[#d4952a]" initial={false} animate={{ width: i < step ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-[#efe2c8] bg-white p-5 shadow-[0_20px_50px_rgba(2,22,35,.06)] sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                {step === 0 ? (
                  <>
                    <h2 className="font-display text-2xl font-bold text-[#021623]">Elige tus experiencias</h2>
                    <p className="mt-1 text-sm text-[#667085]">Puedes seleccionar una o varias para incluirlas en la misma solicitud.</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {[{ name: "" }, ...usedCategories].map((category) => (
                        <button
                          type="button"
                          key={category.name || "todas"}
                          onClick={() => setFilter(category.name)}
                          className={cn("rounded-full border px-4 py-1.5 text-sm font-semibold transition", filter === category.name ? "border-[#d4952a] bg-[#d4952a] text-white" : "border-[#e4d5b8] text-[#475467] hover:border-[#d4952a]")}
                        >
                          {category.name || "Todas"}
                        </button>
                      ))}
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {options.map((item) => {
                        const on = slugs.includes(item.slug);
                        return (
                          <button
                            type="button"
                            key={item.slug}
                            aria-pressed={on}
                            onClick={() => toggle(item.slug)}
                            className={cn("relative flex items-center gap-3 rounded-2xl border-2 p-2.5 text-left transition hover:-translate-y-0.5", on ? "border-[#d4952a] bg-[#fdf6e7]" : "border-[#f0e6d3] hover:border-[#e9c98a]")}
                          >
                            <img src={item.mainImage} alt="" className="h-16 w-20 shrink-0 rounded-xl object-cover" />
                            <span className="min-w-0 flex-1">
                              <b className="block truncate text-sm text-[#021623]">{item.name}</b>
                              <small className="mt-0.5 flex items-center gap-1 text-xs text-[#667085]"><Clock className="h-3 w-3" /> {item.duration}</small>
                              <small className="text-xs font-semibold text-[#b97a0b]">{item.priceFrom ? <>Desde <span translate="no" className="notranslate">{money(item.priceFrom, item.currency)}</span></> : PRICE_ON_REQUEST}</small>
                            </span>
                            <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition", on ? "border-[#d4952a] bg-[#d4952a] text-white" : "border-[#e4d5b8]")}>
                              {on ? <Check className="h-3.5 w-3.5" /> : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : null}

                {step === 1 ? (
                  <>
                    <h2 className="font-display text-2xl font-bold text-[#021623]">¿Cuándo y con quién viajas?</h2>
                    <div className="mt-6 grid gap-8 md:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#b97a0b]">Fecha de inicio</p>
                        <div className="rounded-2xl border border-[#f0e6d3] p-3"><Calendar value={date} onChange={setDate} /></div>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#b97a0b]">Viajeros</p>
                        <div className="rounded-2xl border border-[#f0e6d3] p-2">
                          <Counter label="Adultos" hint="13 años o más" value={adults} min={1} max={20} onChange={setAdults} />
                          <Counter label="Niños" hint="De 2 a 12 años" value={kids} min={0} max={10} onChange={setKids} />
                        </div>
                        <p className="mt-3 text-xs leading-5 text-[#667085]">¿Grupo de más de 20? Escríbenos y armamos una propuesta especial.</p>
                      </div>
                    </div>
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <h2 className="font-display text-2xl font-bold text-[#021623]">Tus datos de contacto</h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-1.5 text-sm font-semibold text-[#344054]">
                        Nombre completo
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Como figura en tu documento" autoComplete="name" className="field font-normal" />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold text-[#344054]">
                        Correo electrónico
                        <input type="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value.trim() })} placeholder="nombre@gmail.com" autoComplete="email" aria-invalid={badEmail} className={cn("field font-normal", badEmail && "border-red-300")} />
                        {badEmail ? <small className="text-xs font-normal text-red-600">{EMAIL_HINT}</small> : null}
                      </label>
                      <div className="grid gap-1.5 text-sm font-semibold text-[#344054]">
                        WhatsApp / teléfono
                        <PhoneField value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
                      </div>
                      <div className="grid gap-1.5 text-sm font-semibold text-[#344054]">
                        País de residencia
                        <Select value={form.country} onChange={(country) => setForm({ ...form, country })} options={countryOptions} buttonClassName="font-normal" />
                      </div>
                      <label className="grid gap-1.5 text-sm font-semibold text-[#344054] sm:col-span-2">
                        Comentarios (opcional)
                        <textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Alergias, celebraciones, hotel preferido, dudas…" className="field font-normal" />
                      </label>
                    </div>
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <h2 className="font-display text-2xl font-bold text-[#021623]">Revisa y confirma</h2>
                    <dl className="mt-6 divide-y divide-[#f0e6d3] rounded-2xl border border-[#f0e6d3]">
                      {[
                        ["Experiencias", <>{selected.map((item) => <span key={item.slug} className="block">{item.name} <small className="text-[#98a2b3]">· {item.duration}</small></span>)}</>, 0],
                        ["Fecha", formatDate(date, true), 1],
                        ["Viajeros", travelersLabel(adults, kids), 1],
                        ["Precio referencial", total ? <><b>{total}</b><br /><small className="text-[#98a2b3]">{personsLabel(people)}</small></> : "A confirmar", -1],
                        ["Contacto", <>{form.name}<br /><small className="text-[#98a2b3]">{form.email} · {form.phone}</small></>, 2],
                      ].map(([label, value, target]) => (
                        <div key={String(label)} className="grid grid-cols-[120px_1fr_auto] items-start gap-3 p-4 text-sm sm:grid-cols-[160px_1fr_auto]">
                          <dt className="text-xs font-bold uppercase tracking-[0.1em] text-[#98a2b3]">{label}</dt>
                          <dd className="text-[#021623]">{value}</dd>
                          {Number(target) >= 0 ? <button type="button" onClick={() => go(Number(target))} className="text-xs font-bold text-[#b97a0b] hover:underline">Cambiar</button> : <span />}
                        </div>
                      ))}
                    </dl>
                    <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl bg-[#fdf6e7] p-4 text-sm leading-6 text-[#475467]">
                      <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-1 h-4 w-4 accent-[#d4952a]" />
                      Entiendo que esta es una solicitud de reserva y que la agencia me confirmará disponibilidad y precio antes de cualquier pago.
                    </label>
                  </>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between border-t border-[#f0e6d3] pt-6">
              {step > 0 ? (
                <button type="button" onClick={() => go(step - 1)} className={buttonClassName("outline", "h-11 px-5")}><ChevronLeft className="h-4 w-4" /> Atrás</button>
              ) : <span />}
              {step < 3 ? (
                <button type="button" disabled={!valid} onClick={() => go(step + 1)} className={buttonClassName("primary", "h-11 px-6 disabled:cursor-not-allowed disabled:opacity-50")}>Continuar <ChevronRight className="h-4 w-4" /></button>
              ) : (
                <button type="button" disabled={!valid} onClick={confirm} className={buttonClassName("primary", "fx-glow h-11 px-6 disabled:cursor-not-allowed disabled:opacity-50 disabled:[animation:none]")}><Send className="h-4 w-4" /> Enviar solicitud</button>
              )}
            </div>
          </div>

          {/* Resumen */}
          <aside className="overflow-hidden rounded-3xl border border-[#efe2c8] bg-white shadow-[0_24px_60px_rgba(2,22,35,.1)] lg:sticky lg:top-28">
            {main ? (
              <>
                <div className="relative h-40">
                  <img src={main.mainImage} alt={main.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021623]/80 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f3c77a]">{selected.length > 1 ? `${selected.length} experiencias` : main.category}</p>
                    <h3 className="font-display text-xl font-bold">{selected.length > 1 ? "Tu selección" : main.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <ul className="grid gap-2">
                    {selected.map((item) => (
                      <li key={item.slug} className="flex items-start gap-2 text-sm">
                        <span className="min-w-0 flex-1">
                          <b className="block truncate text-[#021623]">{item.name}</b>
                          <small className="text-xs text-[#98a2b3]">{item.priceFrom ? `${money(item.priceFrom, item.currency)} × ${personsLabel(people)}` : "Precio a confirmar"}</small>
                        </span>
                        <b className="text-[#021623]">{item.priceFrom ? money(item.priceFrom * people, item.currency) : "—"}</b>
                        <button type="button" aria-label={`Quitar ${item.name}`} onClick={() => toggle(item.slug)} className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[#98a2b3] transition hover:bg-red-50 hover:text-red-600">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-4 grid gap-1.5 border-t border-[#f0e6d3] pt-4 text-sm text-[#475467]">
                    <li className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#b97a0b]" /> {date ? formatDate(date, true) : <em className="text-[#98a2b3]">Fecha por elegir</em>}</li>
                    <li className="flex items-center gap-2"><Users className="h-4 w-4 text-[#b97a0b]" /> {travelersLabel(adults, kids)}</li>
                    <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#b97a0b]" /> {main.location}</li>
                  </ul>
                  <div className="mt-4 flex items-end justify-between rounded-2xl bg-[#021623] p-4 text-white">
                    <span className="text-xs uppercase tracking-[0.14em] text-white/70">{total ? "Total referencial" : "Precio"}</span>
                    <motion.b key={total} translate="no" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="notranslate font-display text-2xl text-[#f3c77a]">{total || "A confirmar"}</motion.b>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid place-items-center gap-3 p-10 text-center text-sm text-[#667085]">
                <MapPin className="h-8 w-8 text-[#d4952a]" />
                Elige una o más experiencias para ver el resumen de tu reserva.
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 border-t border-[#f0e6d3] bg-[#fdf9f0] px-4 py-3 text-xs font-semibold text-[#667085]">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-[#b97a0b]" /> Sin pagos en línea</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-[#b97a0b]" /> Confirmación personalizada</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
