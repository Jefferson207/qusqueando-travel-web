import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Experience } from "@/lib/data";
import { moneyTotal } from "@/lib/money";

// --- Fechas ---

const pad = (n: number) => String(n).padStart(2, "0");
export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
export const formatDate = (s: string, long = false) =>
  s
    ? parseDate(s).toLocaleDateString(
        "es-PE",
        long ? { weekday: "long", day: "numeric", month: "long", year: "numeric" } : { day: "numeric", month: "short", year: "numeric" },
      )
    : "";

export const travelersLabel = (adults: number, kids: number) =>
  `${adults} adulto${adults !== 1 ? "s" : ""}${kids ? `, ${kids} niño${kids !== 1 ? "s" : ""}` : ""}`;
export const personsLabel = (n: number) => `${n} persona${n !== 1 ? "s" : ""}`;

// --- Datos del viaje en la URL (se llevan del buscador a la reserva) ---

export type Trip = { destination?: string; date?: string; adults?: number; kids?: number };

export function tripQuery({ destination, date, adults, kids }: Trip) {
  const params = new URLSearchParams();
  if (destination) params.set("categoria", destination);
  if (date) params.set("fecha", date);
  if (adults) params.set("adultos", String(adults));
  if (kids) params.set("ninos", String(kids));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function useTripParams() {
  const [params] = useSearchParams();
  const adults = Math.min(20, Math.max(1, Number(params.get("adultos")) || 2));
  const kids = Math.min(10, Math.max(0, Number(params.get("ninos")) || 0));
  const date = params.get("fecha") || "";
  return {
    destination: params.get("categoria") || "",
    date,
    adults,
    kids,
    /** Fecha y viajeros, sin el destino, para pasarlos a la ficha o la reserva. */
    query: tripQuery({ date, adults, kids }),
  };
}

// --- Precios: cada paquete es por persona y puede estar en USD o PEN ---

export function tripTotals(items: Experience[], people: number) {
  return moneyTotal(items.map((item) => ({ price: item.priceFrom, currency: item.currency })), people);
}

// --- "Mi viaje": paquetes guardados en el navegador ---

const CART_KEY = "qusqueando-mi-viaje";
const CART_EVENT = "qusqueando-mi-viaje-cambio";
const MAX_ITEMS = 12;

export function cartSlugs(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved) ? [...new Set(saved.filter((slug): slug is string => typeof slug === "string"))].slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

function saveCart(slugs: string[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(slugs));
  } catch {
    // sin almacenamiento: el carrito vive solo en esta página
  }
  window.dispatchEvent(new Event(CART_EVENT));
}

export const addToCart = (slug: string) => {
  const current = cartSlugs();
  if (!current.includes(slug) && current.length < MAX_ITEMS) saveCart([...current, slug]);
};
export const removeFromCart = (slug: string) => saveCart(cartSlugs().filter((item) => item !== slug));
export const cartIsFull = () => cartSlugs().length >= MAX_ITEMS;
export const replaceCart = (slugs: string[]) => saveCart([...new Set(slugs)].slice(0, MAX_ITEMS));
export const clearCart = () => saveCart([]);

// Panel lateral de "Mi viaje" (components/trip-drawer.tsx)
const OPEN_EVENT = "qusqueando-mi-viaje-abrir";
export const openTrip = () => window.dispatchEvent(new Event(OPEN_EVENT));

export function useTripOpener(onOpen: () => void) {
  useEffect(() => {
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [onOpen]);
}

/** Agrega o quita un paquete; al agregarlo abre el panel para que se vea la cesta. */
export function toggleInCart(slug: string) {
  if (cartSlugs().includes(slug)) return removeFromCart(slug);
  addToCart(slug);
  openTrip();
}

export function useCart() {
  const [slugs, setSlugs] = useState(cartSlugs);
  useEffect(() => {
    const sync = () => setSlugs(cartSlugs());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return slugs;
}
