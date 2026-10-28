import { cacheLife, cacheTag } from "next/cache";

// Camada de dados dos gatinhos para adoção: busca na API (pasta api/ do projeto).
// As páginas só usam getAvailableCats e getCatBySlug, sem saber de onde vêm os dados.

export type Sex = "F" | "M";
export type TestResult = "negativo" | "positivo" | "nao_testado";

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
  vetCare: {
    neutered: boolean;
    vaccinated: boolean;
    dewormed: boolean;
    fiv: TestResult;
    felv: TestResult;
  };
  story: string;
  traits: string[];
  status: "disponivel" | "adotado";
};

// Endereço da API. No computador: http://localhost:3333 (web/.env.local).
// Na Vercel: variável de ambiente API_URL com o endereço da API publicada.
function apiUrl(path: string) {
  const base = process.env.API_URL;
  if (!base) {
    throw new Error("Defina a variável de ambiente API_URL (ex.: http://localhost:3333 no web/.env.local).");
  }
  return `${base.replace(/\/$/, "")}${path}`;
}

// As respostas ficam em cache (as páginas continuam estáticas e rápidas) e são
// atualizadas a cada hora. A tag "cats" permitirá atualizar na hora, quando um
// admin incluir, editar ou excluir um gato.
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
