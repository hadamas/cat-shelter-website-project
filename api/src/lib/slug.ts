// Endereços amigáveis: "Caneca Natal 2026" → "caneca-natal-2026"
export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70) || "item";

/** Escolhe o primeiro endereço livre: "caneca", "caneca-2", "caneca-3"... */
export function pickFreeSlug(base: string, taken: string[]) {
  const used = new Set(taken);
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
