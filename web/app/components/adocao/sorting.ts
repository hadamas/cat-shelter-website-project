import type { Cat } from "@/app/lib/cats";

export const SORT_OPTIONS = {
  "mais-tempo": "Há mais tempo no gatil",
  "menos-tempo": "Chegaram há menos tempo",
  "nome": "Nome (A–Z)",
  "mais-novos": "Mais novos",
  "mais-velhos": "Mais velhos",
} as const;

export type SortKey = keyof typeof SORT_OPTIONS;

// Padrão: quem espera há mais tempo aparece primeiro (mais chance de ser adotado).
export const DEFAULT_SORT: SortKey = "mais-tempo";

export function isSortKey(v: string | null): v is SortKey {
  return v !== null && v in SORT_OPTIONS;
}

// Datas "AAAA-MM-DD" podem ser comparadas como texto.
export function sortCats(cats: Cat[], key: SortKey) {
  const list = [...cats];
  switch (key) {
    case "mais-tempo":
      return list.sort((a, b) => a.arrivalDate.localeCompare(b.arrivalDate));
    case "menos-tempo":
      return list.sort((a, b) => b.arrivalDate.localeCompare(a.arrivalDate));
    case "nome":
      return list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    case "mais-novos":
      return list.sort((a, b) => b.birthDate.localeCompare(a.birthDate));
    case "mais-velhos":
      return list.sort((a, b) => a.birthDate.localeCompare(b.birthDate));
  }
}
