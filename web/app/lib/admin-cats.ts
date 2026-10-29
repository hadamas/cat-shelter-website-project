import { apiUrl } from "./api";
import type { Cat, Sex } from "./cats";
import { getSupabase } from "./supabase";

// Funções usadas pelo modal de cadastro/edição de gatinhos (só admins).

export type CatInput = {
  name: string;
  sex: Sex;
  birthDate: string;
  arrivalDate: string;
  coatColor: string;
  vetCare: string[];
  story: string;
  traits: string[];
  status: Cat["status"];
  photos: { url: string; alt: string }[];
};

export type ApiError = { error: string; details?: Record<string, string[] | undefined> };

/** Cadastra (sem id) ou edita (com id) um gato. */
export async function saveCat(token: string, input: CatInput, id?: string): Promise<{ cat?: Cat; error?: ApiError }> {
  try {
    const res = await fetch(apiUrl(id ? `/cats/${id}` : "/cats"), {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    });
    const body = await res.json().catch(() => ({}));
    return res.ok ? { cat: body as Cat } : { error: { error: "Não foi possível salvar.", ...body } };
  } catch {
    return { error: { error: "Sem conexão com o servidor. Tente novamente." } };
  }
}

// ---------------------------------------------------------------------------
// Fotos: vão direto do navegador para o Supabase Storage (bucket "cats").
// Só admins conseguem enviar (regra criada na migration 0004).
// ---------------------------------------------------------------------------

const BUCKET = "cats";
const MAX_SIDE = 1600; // px: suficiente para a galeria, e deixa o arquivo leve

/** Reduz a foto e converte para WebP antes de enviar (fotos de celular têm vários MB). */
async function compress(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
    return blob ?? file;
  } catch {
    return file; // navegador sem suporte: envia o original
  }
}

export async function uploadCatPhoto(file: File): Promise<string> {
  const blob = await compress(file);
  const ext = blob.type === "image/webp" ? "webp" : (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;
  const storage = getSupabase().storage.from(BUCKET);
  const { error } = await storage.upload(path, blob, { contentType: blob.type || file.type, cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return storage.getPublicUrl(path).data.publicUrl;
}

/** Apaga do Storage as fotos que foram removidas de um gato (melhor esforço). */
export async function deleteCatPhotos(urls: string[]) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const paths = urls.filter((u) => u.includes(marker)).map((u) => decodeURIComponent(u.split(marker)[1]!));
  if (paths.length === 0) return;
  try {
    await getSupabase().storage.from(BUCKET).remove(paths);
  } catch {
    // não atrapalha o salvamento: no pior caso o arquivo fica sobrando no Storage
  }
}
