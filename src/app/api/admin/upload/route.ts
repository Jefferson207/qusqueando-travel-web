import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const maxBytes = 5 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const uploadUrl = process.env.CPANEL_UPLOAD_URL;
  const token = process.env.CPANEL_UPLOAD_TOKEN;

  if (!uploadUrl || !token) {
    return NextResponse.json({ error: "Upload no configurado" }, { status: 500 });
  }

  const incoming = await request.formData();
  const file = incoming.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo (campo 'file')" }, { status: 400 });
  }
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Formato no permitido. Usa JPG, PNG, WebP o AVIF." }, { status: 415 });
  }
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "La imagen supera los 5 MB." }, { status: 413 });
  }

  // Solo se reenvía el archivo y el token del servidor, nunca otros campos del cliente.
  const outgoing = new FormData();
  outgoing.append("file", file);
  outgoing.append("token", token);

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: outgoing,
  });

  const text = await response.text();
  try {
    return NextResponse.json(JSON.parse(text), { status: response.status });
  } catch {
    return NextResponse.json({ raw: text }, { status: response.status });
  }
}
