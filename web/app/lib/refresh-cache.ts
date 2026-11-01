"use server";

import { updateTag } from "next/cache";
import { apiUrl } from "./api";

// Atualiza na hora as páginas do site depois que um admin cadastra, edita ou
// exclui algo (sem esperar o cache vencer).
// "cats": páginas de adoção. "products": páginas da Lojinha.
// Confere na API se o token é mesmo de um admin: assim ninguém de fora
// consegue forçar a atualização do cache.
export async function refreshCache(token: string, tag: "cats" | "products"): Promise<boolean> {
  try {
    const res = await fetch(apiUrl("/me"), { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) return false;
    const me = (await res.json()) as { role?: string };
    if (me.role !== "admin") return false;
  } catch {
    return false;
  }
  updateTag(tag);
  return true;
}
