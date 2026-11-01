import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // indicador do Next.js (só no "npm run dev"): no canto direito, para não
  // ficar em cima do botão da sacola
  devIndicators: { position: "bottom-right" },
  // A Lojinha saiu de dentro de "Como Ajudar": o endereço antigo leva ao novo
  async redirects() {
    return [{ source: "/como-ajudar/lojinha", destination: "/lojinha", permanent: true }];
  },
  images: {
    // fotos dos gatinhos enviadas pelo painel de admin (Supabase Storage)
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
