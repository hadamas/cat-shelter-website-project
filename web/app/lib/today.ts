import { cacheLife } from "next/cache";

// Data de "hoje" (AAAA-MM-DD) usada para calcular idade e tempo no gatil.
// As páginas são pré-renderizadas; com "use cache" + cacheLife("days"),
// a data é recalculada uma vez por dia e servidor e navegador usam o mesmo valor.
export async function getToday() {
  "use cache";
  cacheLife("days");
  return new Date().toISOString().slice(0, 10);
}
