"use client";

import { useState } from "react";
import { currentPrice, type Product } from "@/app/lib/shop";
import ProductCard from "./ProductCard";

const SORTS = {
  recentes: { label: "Mais recentes", fn: () => 0 },
  nome: { label: "Nome (A–Z)", fn: (a: Product, b: Product) => a.name.localeCompare(b.name, "pt-BR") },
  "menor-preco": { label: "Menor preço", fn: (a: Product, b: Product) => currentPrice(a) - currentPrice(b) },
  "maior-preco": { label: "Maior preço", fn: (a: Product, b: Product) => currentPrice(b) - currentPrice(a) },
} as const;
type SortKey = keyof typeof SORTS;

export const PRODUCT_GRID_CLASSES = "grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4";

// Listagem com contador e ordenação. Esgotados vão para o fim da lista.
export default function ProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("recentes");
  const sorted = [...products]
    .sort(SORTS[sort].fn)
    .sort((a, b) => Number(a.stock <= 0) - Number(b.stock <= 0)); // sort estável: mantém a ordem escolhida

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-sm text-main-brown/60" aria-live="polite">
          {products.length} {products.length === 1 ? "produto" : "produtos"}
        </p>
        <label className="flex items-center gap-2 whitespace-nowrap text-sm text-main-brown/80">
          <span className="hidden sm:inline">Ordenar por</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Ordenar produtos"
            className="cursor-pointer rounded-full border border-main-brown/20 bg-white py-2 pl-4 pr-9 font-semibold text-main-brown transition-colors hover:border-main-blue focus:border-main-blue focus:outline-none"
          >
            {Object.entries(SORTS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className={PRODUCT_GRID_CLASSES}>
        {sorted.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
