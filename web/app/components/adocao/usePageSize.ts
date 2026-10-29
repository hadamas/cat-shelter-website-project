"use client";

import { useSyncExternalStore } from "react";

// Quantos cards por página, conforme a largura da tela (iguais às colunas do grid):
// celular: 2 colunas × 8 fileiras = 16 | tablet (md): 3 × 2 = 6 | desktop (lg): 4 × 2 = 8
const QUERIES = [
  { query: "(min-width: 1024px)", size: 8 },
  { query: "(min-width: 768px)", size: 6 },
];
const MOBILE = 16;

function getSize() {
  return QUERIES.find((q) => window.matchMedia(q.query).matches)?.size ?? MOBILE;
}

function subscribe(callback: () => void) {
  const lists = QUERIES.map((q) => window.matchMedia(q.query));
  lists.forEach((l) => l.addEventListener("change", callback));
  return () => lists.forEach((l) => l.removeEventListener("change", callback));
}

/** `serverSize` é usado na pré-renderização, quando ainda não se sabe o tamanho da tela. */
export function usePageSize(serverSize: number) {
  return useSyncExternalStore(subscribe, getSize, () => serverSize);
}
