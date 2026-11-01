import { cacheLife, cacheTag } from "next/cache";
import { apiUrl } from "./api";

// Camada de dados da Lojinha: busca os produtos na API (só no servidor).
// Tipos e funções usados também no navegador ficam em lib/shop.ts.

export type { Product, ProductPhoto } from "./shop";
export { currentPrice, hasVariations } from "./shop";
import type { Product } from "./shop";

// Em cache, como os gatos: atualizado a cada hora ou na hora em que um admin
// cadastra, edita ou exclui um produto (tag "products").
export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const res = await fetch(apiUrl("/products"));
  if (!res.ok) throw new Error(`API respondeu ${res.status} ao listar os produtos`);
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product-${slug}`);

  const res = await fetch(apiUrl(`/products/${encodeURIComponent(slug)}`));
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API respondeu ${res.status} ao buscar o produto "${slug}"`);
  return res.json();
}
