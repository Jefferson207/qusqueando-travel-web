// Cambio de idioma ES / EN / IT con el traductor de Google (traduce también
// el contenido que se carga desde /admin). El idioma se guarda en la cookie
// «googtrans» que usa Google; al cambiarlo se recarga la página.

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate: { TranslateElement: new (options: object, id: string) => unknown } };
  }
}

export const languages = [
  { code: "es", label: "ES", name: "Español" },
  { code: "en", label: "EN", name: "English" },
  { code: "it", label: "IT", name: "Italiano" },
] as const;
export type Lang = (typeof languages)[number]["code"];

export function currentLang(): Lang {
  const match = document.cookie.match(/googtrans=\/es\/(en|it)/);
  return (match?.[1] as Lang) ?? "es";
}

function setCookie(value: string) {
  const expires = value ? "" : ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const host = location.hostname;
  const root = host.split(".").slice(-2).join(".");
  for (const domain of ["", `;domain=${host}`, `;domain=.${root}`]) document.cookie = `googtrans=${value}${expires};path=/${domain}`;
}

export function setLang(lang: Lang) {
  if (lang === currentLang()) return;
  setCookie(lang === "es" ? "" : `/es/${lang}`);
  location.reload();
}

/** Google cambia los textos por etiquetas <font>; esto evita que React falle al actualizar esos nodos. */
function patchDom() {
  const remove = Node.prototype.removeChild;
  const insert = Node.prototype.insertBefore;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    return child.parentNode === this ? (remove.call(this, child) as T) : child;
  };
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    return ref && ref.parentNode !== this ? node : (insert.call(this, node, ref) as T);
  };
}

/** Solo descarga el traductor cuando la persona eligió inglés o italiano. */
export function startTranslation() {
  const lang = currentLang();
  if (lang === "es") return;
  patchDom();
  document.documentElement.lang = lang;
  const box = document.createElement("div");
  box.id = "google_translate_element";
  box.hidden = true;
  document.body.appendChild(box);
  window.googleTranslateElementInit = () => {
    if (window.google) new window.google.translate.TranslateElement({ pageLanguage: "es", includedLanguages: "en,it,es", autoDisplay: false }, "google_translate_element");
  };
  const script = document.createElement("script");
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.head.appendChild(script);
}
