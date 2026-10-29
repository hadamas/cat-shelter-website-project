import type { MetadataRoute } from "next";
import { siteUrl } from "@/app/lib/site";

// Gera /robots.txt: libera o site para buscadores e indica onde está o sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/esqueci-senha", "/redefinir-senha", "/admin"], // áreas restritas (a criar) não aparecem no Google
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
