// Funções de datas usadas nos cards dos gatinhos.
// As datas vêm no formato "AAAA-MM-DD" (como virão do banco).

/** Meses completos entre duas datas. */
export function monthsBetween(from: string, to: string) {
  const a = new Date(`${from}T00:00:00`);
  const b = new Date(`${to}T00:00:00`);
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  if (b.getDate() < a.getDate()) months -= 1;
  return Math.max(0, months);
}

/** 0 → "menos de 1 mês", 5 → "5 meses", 12 → "1 ano", 28 → "2 anos e 4 meses" */
export function formatMonths(total: number) {
  if (total < 1) return "menos de 1 mês";
  const years = Math.floor(total / 12);
  const months = total % 12;
  const y = years === 1 ? "1 ano" : `${years} anos`;
  const m = months === 1 ? "1 mês" : `${months} meses`;
  if (years === 0) return m;
  if (months === 0) return y;
  return `${y} e ${m}`;
}
