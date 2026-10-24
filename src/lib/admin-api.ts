// Cliente del panel: guarda el token de sesión y llama a la API (/api/*).
const TOKEN_KEY = "qt_admin_token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setToken(token: string) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // sin almacenamiento: la sesión dura solo esta pestaña
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Llama a la API con el token del administrador. Lanza ApiError con el mensaje del servidor. */
export async function api<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const isForm = options.body instanceof FormData;
  const response = await fetch(path, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(options.body && !isForm ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body === undefined ? undefined : isForm ? (options.body as FormData) : JSON.stringify(options.body),
  });
  const data = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) {
    if (response.status === 401) setToken("");
    throw new ApiError(response.status, data.message ?? "No se pudo completar la acción. Inténtalo de nuevo.");
  }
  return data as T;
}
