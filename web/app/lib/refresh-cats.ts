"use server";

import { updateTag } from "next/cache";
import { apiUrl } from "./api";

// Atualiza na hora as páginas de adoção depois que um admin cadastra ou edita
// um gato (sem esperar a hora do cache vencer).
// Confere na API se o token é mesmo de um admin: assim ninguém de fora
// consegue forçar a atualização do cache.
export async function refreshCats(token: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl("/me"), { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) return false;
    const me = (await res.json()) as { role?: string };
    if (me.role !== "admin") return false;
  } catch {
    return false;
  }
  updateTag("cats");
  return true;
}
