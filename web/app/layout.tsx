import type { Metadata, Viewport } from "next";
import { Chewy, Geist } from "next/font/google";
import AuthProvider from "@/app/components/auth/AuthProvider";
import TopBar from "@/app/components/TopBar";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { siteConfig, siteUrl } from "@/app/lib/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} | Adoção de gatos`,
    template: `%s | ${siteConfig.name}`, // páginas internas: "Quem Somos | Gatos de Francisca"
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["adoção de gatos", "gatil", "adotar gato", "ONG de gatos", siteConfig.name],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    // a imagem de compartilhamento é gerada por app/opengraph-image.tsx
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  // Código de verificação do Google Search Console (variável de ambiente na Vercel)
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0095d2", // cor da barra do navegador no celular
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`${geist.variable} ${chewy.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {/* AuthProvider: guarda quem está logado (o resto do site continua estático) */}
        <AuthProvider>
          <TopBar />
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 bg-white shadow-[0_0_40px_rgb(0_0_0/0.04)]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
