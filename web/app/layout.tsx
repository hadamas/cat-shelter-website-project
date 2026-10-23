import type { Metadata, Viewport } from "next";
import { Chewy, Geist } from "next/font/google";
import TopBar from "@/app/components/TopBar";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { siteConfig } from "@/app/lib/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const chewy = Chewy({
  variable: "--font-chewy",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// URL base para links absolutos (Open Graph, canonical, sitemap).
// Na Vercel, VERCEL_PROJECT_PRODUCTION_URL é definida automaticamente.
// Quando comprar o domínio, defina NEXT_PUBLIC_SITE_URL=https://seudominio.com.br
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} | Adoção de gatos`,
    template: `%s | ${siteConfig.name}`, // páginas internas: "Quem Somos | Gatos de Francisca"
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["adoção de gatos", "gatil", "adotar gato", "ONG de gatos", siteConfig.name],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    images: [{ url: "/images/logo.png", width: 1014, height: 589, alt: siteConfig.name }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0095d2", // cor da barra do navegador no celular
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${chewy.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <TopBar />
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 bg-white shadow-[0_0_40px_rgb(0_0_0/0.04)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
