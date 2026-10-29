"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Cat } from "@/app/lib/cats";
import CatCard from "./CatCard";
import Pagination from "./Pagination";
import { DEFAULT_SORT, SORT_OPTIONS, isSortKey, sortCats, type SortKey } from "./sorting";
import { usePageSize } from "./usePageSize";

export const GRID_CLASSES = "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5";

// Listagem com ordenação e paginação.
// A ordem e a página ficam no endereço (?ordem=nome&pagina=2): dá para
// compartilhar o link e o botão "voltar" do navegador funciona.
export default function CatGallery({ cats, today }: { cats: Cat[]; today: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const topRef = useRef<HTMLDivElement>(null);

  const sortParam = params.get("ordem");
  const sort: SortKey = isSortKey(sortParam) ? sortParam : DEFAULT_SORT;
  const pageSize = usePageSize(8);
  const totalPages = Math.max(1, Math.ceil(cats.length / pageSize));
  const page = Math.min(Math.max(1, Number(params.get("pagina")) || 1), totalPages);

  const visible = sortCats(cats, sort).slice((page - 1) * pageSize, page * pageSize);

  function navigate(next: { ordem?: SortKey; pagina?: number }) {
    const q = new URLSearchParams(params);
    if (next.ordem) q.set("ordem", next.ordem);
    if (next.pagina) q.set("pagina", String(next.pagina));
    if (q.get("ordem") === DEFAULT_SORT) q.delete("ordem");
    if (q.get("pagina") === "1") q.delete("pagina");
    const query = q.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function goToPage(p: number) {
    navigate({ pagina: p });
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      <div className="mb-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-main-brown/70" aria-live="polite">
          {cats.length} {cats.length === 1 ? "gatinho esperando" : "gatinhos esperando"} por um lar
        </p>
        <label className="flex items-center gap-2 whitespace-nowrap text-sm text-main-brown/80 sm:justify-end">
          Ordenar por
          <select
            value={sort}
            onChange={(e) => navigate({ ordem: e.target.value as SortKey, pagina: 1 })}
            className="flex-1 cursor-pointer rounded-full border border-main-brown/20 bg-white py-2 pl-4 pr-9 font-semibold text-main-brown transition-colors hover:border-main-blue focus:border-main-blue focus:outline-none sm:flex-none"
          >
            {Object.entries(SORT_OPTIONS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className={GRID_CLASSES}>
        {visible.map((cat) => (
          <li key={cat.id}>
            <CatCard cat={cat} today={today} />
          </li>
        ))}
      </ul>

      <Pagination current={page} total={totalPages} onChange={goToPage} />
    </div>
  );
}
