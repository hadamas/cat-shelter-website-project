import { cacheLife, cacheTag } from "next/cache";
import { apiUrl } from "./api";

// Camada de dados dos gatinhos para adoção: busca na API (pasta api/ do projeto).
// As páginas só usam getAvailableCats e getCatBySlug, sem saber de onde vêm os dados.

export type Sex = "F" | "M";

export type CatPhoto = { src: string; alt: string };

export type Cat = {
  id: string;
  /** usado no endereço da página: /como-ajudar/adote/{slug} */
  slug: string;
  name: string;
  sex: Sex;
  /** data de nascimento (aproximada) — calcula a idade */
  birthDate: string;
  /** data de entrada no gatil — calcula o tempo esperando adoção */
  arrivalDate: string;
  coatColor: string;
  /** a primeira foto é a principal (card) */
  photos: CatPhoto[];
  /** cuidados veterinários, um por item. Ex.: ["Castrado", "FIV negativo"] */
  vetCare: string[];
  story: string;
  traits: string[];
  status: "disponivel" | "adotado";
};

// As respostas ficam em cache (as páginas continuam estáticas e rápidas) e são
// atualizadas a cada hora. Quando um admin cadastra ou edita um gato, a tag
// "cats" é atualizada na hora (ver lib/refresh-cats.ts).
export async function getAvailableCats(): Promise<Cat[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("cats");

  const res = await fetch(apiUrl("/cats?status=disponivel"));
  if (!res.ok) throw new Error(`API respondeu ${res.status} ao listar os gatos`);
  return res.json();
}

export async function getCatBySlug(slug: string): Promise<Cat | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("cats", `cat-${slug}`);

  const res = await fetch(apiUrl(`/cats/${encodeURIComponent(slug)}`));
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API respondeu ${res.status} ao buscar o gato "${slug}"`);
  return res.json();
}
