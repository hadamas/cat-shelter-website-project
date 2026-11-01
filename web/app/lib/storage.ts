import { getSupabase } from "./supabase";

// Fotos enviadas pelo painel de admin: vão direto do navegador para o Supabase
// Storage. Só admins conseguem enviar (regras nas migrations 0004 e 0006).
export type PhotoBucket = "cats" | "products";

const MAX_SIDE = 1600; // px: suficiente para as galerias, e deixa o arquivo leve

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

export async function uploadPhoto(bucket: PhotoBucket, file: File): Promise<string> {
  const blob = await compress(file);
  const ext = blob.type === "image/webp" ? "webp" : (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;
  const storage = getSupabase().storage.from(bucket);
  const { error } = await storage.upload(path, blob, { contentType: blob.type || file.type, cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return storage.getPublicUrl(path).data.publicUrl;
}

/** Apaga do Storage fotos que não são mais usadas (melhor esforço). */
export async function deletePhotos(bucket: PhotoBucket, urls: string[]) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const paths = urls.filter((u) => u.includes(marker)).map((u) => decodeURIComponent(u.split(marker)[1]!));
  if (paths.length === 0) return;
  try {
    await getSupabase().storage.from(bucket).remove(paths);
  } catch {
    // não atrapalha o salvamento: no pior caso o arquivo fica sobrando no Storage
  }
}
