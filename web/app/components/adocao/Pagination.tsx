import { ChevronLeftIcon, ChevronRightIcon } from "@/app/components/icons";

// Lista de páginas a mostrar: 1 … 4 5 6 … 10 (com "…" quando há muitas)
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export default function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  if (total <= 1) return null;

  const arrow =
    "grid size-10 place-items-center rounded-full border border-main-brown/15 text-main-brown transition-colors hover:border-main-blue hover:text-main-blue disabled:pointer-events-none disabled:opacity-30";

  return (
    <nav aria-label="Paginação" className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2">
      <button type="button" onClick={() => onChange(current - 1)} disabled={current === 1} className={arrow} aria-label="Página anterior">
        <ChevronLeftIcon width={18} height={18} />
      </button>

      <ol className="flex items-center gap-1 sm:gap-1.5">
        {pageList(current, total).map((p, i) =>
          p === "…" ? (
            <li key={`gap-${i}`} aria-hidden className="w-6 text-center text-main-brown/50">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === current ? "page" : undefined}
                aria-label={`Página ${p}`}
                className={`grid size-10 place-items-center rounded-full text-sm font-bold transition-colors ${
                  p === current ? "bg-main-orange text-main-brown" : "text-main-brown/70 hover:bg-main-orange/15"
                }`}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ol>

      <button type="button" onClick={() => onChange(current + 1)} disabled={current === total} className={arrow} aria-label="Próxima página">
        <ChevronRightIcon width={18} height={18} />
      </button>
    </nav>
  );
}
