import type { Metadata } from "next";
import Hero from "@/app/components/home/Hero";
import { hero } from "@/app/content/home";
import JsonLd from "@/app/components/JsonLd";
import { contactInfo, shelterAddress, siteConfig, siteUrl, socialLinks } from "@/app/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Dados estruturados: diz ao Google que o site é de um abrigo de animais,
// com nome, logo, contato e redes sociais.
const address = Object.fromEntries(Object.entries(shelterAddress).filter(([, v]) => v));
const shelterJsonLd = {
  "@context": "https://schema.org",
  "@type": "AnimalShelter",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  image: `${siteUrl}/opengraph-image`,
  telephone: contactInfo.whatsappNumber,
  sameAs: Object.values(socialLinks),
  address: { "@type": "PostalAddress", ...address },
};

export default function Home() {
  return (
    <>
      <JsonLd data={shelterJsonLd} />
      <Hero content={hero} />
    </>
  );
}
