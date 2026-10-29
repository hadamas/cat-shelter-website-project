import type { MetadataRoute } from "next";
import { comoAjudarItems, navItems, siteUrl } from "@/app/lib/site";
import { getAvailableCats } from "@/app/lib/cats";

// Gera /sitemap.xml com todas as páginas do menu.
// Ao criar uma página nova no site.ts, ela entra aqui automaticamente.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = [...navItems.map((i) => i.href), ...comoAjudarItems.map((i) => i.href)];

  // páginas de cada gatinho disponível
  const cats = await getAvailableCats();
  paths.push(...cats.map((c) => `/como-ajudar/adote/${c.slug}`));

  return [...new Set(paths)].map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: path === "/" || path.includes("adote") ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
  }));
}
