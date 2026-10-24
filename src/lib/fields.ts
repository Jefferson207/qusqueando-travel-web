// Reglas de los campos de contacto (reserva y formularios).

/** Países frecuentes entre viajeros; min/max = dígitos del número sin el código. */
export type Country = { iso: string; name: string; code: string; min: number; max: number };
export const COUNTRIES: Country[] = [
  { iso: "PE", name: "Perú", code: "51", min: 9, max: 9 },
  { iso: "AR", name: "Argentina", code: "54", min: 10, max: 11 },
  { iso: "BO", name: "Bolivia", code: "591", min: 8, max: 8 },
  { iso: "BR", name: "Brasil", code: "55", min: 10, max: 11 },
  { iso: "CL", name: "Chile", code: "56", min: 9, max: 9 },
  { iso: "CO", name: "Colombia", code: "57", min: 10, max: 10 },
  { iso: "EC", name: "Ecuador", code: "593", min: 8, max: 9 },
  { iso: "MX", name: "México", code: "52", min: 10, max: 10 },
  { iso: "UY", name: "Uruguay", code: "598", min: 8, max: 8 },
  { iso: "VE", name: "Venezuela", code: "58", min: 10, max: 10 },
  { iso: "US", name: "Estados Unidos / Canadá", code: "1", min: 10, max: 10 },
  { iso: "ES", name: "España", code: "34", min: 9, max: 9 },
  { iso: "FR", name: "Francia", code: "33", min: 9, max: 9 },
  { iso: "DE", name: "Alemania", code: "49", min: 10, max: 11 },
  { iso: "IT", name: "Italia", code: "39", min: 9, max: 11 },
  { iso: "GB", name: "Reino Unido", code: "44", min: 10, max: 10 },
  { iso: "NL", name: "Países Bajos", code: "31", min: 9, max: 9 },
  { iso: "CH", name: "Suiza", code: "41", min: 9, max: 9 },
  { iso: "AU", name: "Australia", code: "61", min: 9, max: 9 },
  { iso: "JP", name: "Japón", code: "81", min: 10, max: 10 },
];
export const OTHER_COUNTRY = "otro";
export const flag = (iso: string) => String.fromCodePoint(...[...iso].map((c) => 0x1f1a5 + c.charCodeAt(0)));

/** Teléfono guardado como «+CÓDIGO NÚMERO» (ej.: «+51 987654321»). */
export const joinPhone = (iso: string, number: string) => {
  const country = COUNTRIES.find((c) => c.iso === iso);
  return country ? (number ? `+${country.code} ${number}` : "") : number;
};

export function splitPhone(value: string, fallback = "PE"): { iso: string; number: string } {
  const match = value.match(/^\+(\d+) (\d*)$/);
  if (match) {
    const country = COUNTRIES.find((c) => c.iso === fallback && c.code === match[1]) || COUNTRIES.find((c) => c.code === match[1]);
    if (country) return { iso: country.iso, number: match[2] };
  }
  return value ? { iso: OTHER_COUNTRY, number: value } : { iso: fallback, number: "" };
}

/** Solo dígitos; con «Otro país» se permite el «+» inicial. */
export const cleanPhone = (value: string, other = false) =>
  (other && value.trim().startsWith("+") ? "+" : "") + value.replace(/\D/g, "").slice(0, 15);

export function validPhone(value: string) {
  const match = value.match(/^\+(\d+) (\d+)$/);
  if (match) {
    const list = COUNTRIES.filter((c) => c.code === match[1]);
    if (list.length) return list.some((c) => match[2].length >= c.min && match[2].length <= c.max);
  }
  return /^\+\d{7,15}$/.test(value.replace(/\s/g, ""));
}

export const phoneHint = (iso: string) => {
  const country = COUNTRIES.find((c) => c.iso === iso);
  return country
    ? `El número de ${country.name} tiene ${country.min === country.max ? country.min : `${country.min} a ${country.max}`} dígitos (sin el +${country.code}).`
    : "Escribe el número completo con el código de país, por ejemplo +44 7911123456.";
};

export const validEmail = (value: string) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(value.trim());
export const EMAIL_HINT = "Escribe un correo válido, por ejemplo nombre@gmail.com.";
