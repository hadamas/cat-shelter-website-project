import { apiUrl } from "./api";
import type { Cat, Sex } from "./cats";
import { deletePhotos, uploadPhoto } from "./storage";

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

// Fotos dos gatos: bucket "cats" do Supabase Storage (ver lib/storage.ts).
export const uploadCatPhoto = (file: File) => uploadPhoto("cats", file);
export const deleteCatPhotos = (urls: string[]) => deletePhotos("cats", urls);
