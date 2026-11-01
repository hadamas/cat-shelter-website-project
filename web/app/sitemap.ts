import type { MetadataRoute } from "next";
import { comoAjudarItems, navItems, siteUrl } from "@/app/lib/site";
import { getAvailableCats } from "@/app/lib/cats";
import { getProducts } from "@/app/lib/products";

// Gera /sitemap.xml com todas as páginas do menu.
// Ao criar uma página nova no site.ts, ela entra aqui automaticamente.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = [...navItems.map((i) => i.href), ...comoAjudarItems.map((i) => i.href)];

  // páginas de cada gatinho disponível
  const [cats, products] = await Promise.all([getAvailableCats(), getProducts()]);
  paths.push(...cats.map((c) => `/como-ajudar/adote/${c.slug}`));
  // páginas de cada produto da Lojinha
  paths.push(...products.map((p) => `/lojinha/${p.slug}`));

  return [...new Set(paths)].map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: path === "/" || path.includes("adote") || path.startsWith("/lojinha") ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
  }));
}
