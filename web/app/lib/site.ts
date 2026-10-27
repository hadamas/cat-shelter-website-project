// Configurações centrais do site: navegação, links e redes sociais.
// Altere aqui e o Header/Footer se atualizam juntos.

// URL pública do site, usada em links absolutos (Open Graph, canonical, sitemap).
// Na Vercel, VERCEL_PROJECT_PRODUCTION_URL é definida automaticamente e já passa
// a ser o domínio próprio quando ele for configurado no projeto.
// Para forçar outro endereço, defina NEXT_PUBLIC_SITE_URL=https://seudominio.com.br
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteConfig = {
  name: "Gatos de Francisca",
  description:
    "ONG Animal Gatil Gatos de Francisca: resgate, cuidado e adoção responsável de gatinhos. Conheça os gatos disponíveis para adoção e saiba como ajudar.",
};

export type NavItem = { label: string; href: string; description?: string };

// Cada item é uma página própria (rota). Para criar uma página nova:
// 1) adicione o item aqui  2) crie a pasta correspondente em app/
export const comoAjudarItems: NavItem[] = [
  { label: "Adote um gatinho", href: "/como-ajudar/adote", description: "Conheça os gatos que esperam por um lar." },
  { label: "Seja voluntário", href: "/como-ajudar/voluntariado", description: "Doe seu tempo e talento ao gatil." },
  { label: "Lojinha", href: "/como-ajudar/lojinha", description: "Compre produtos e ajude a manter o gatil." },
  { label: "Doações", href: "/como-ajudar/doacao", description: "Contribua com Pix, ração ou outros itens." },
  { label: "Contas", href: "/como-ajudar/contas", description: "Veja como os recursos são usados." },
];

export const navItems: (NavItem & { children?: NavItem[] })[] = [
  { label: "Home", href: "/" },
  { label: "Quem Somos", href: "/quem-somos" },
  { label: "Como Ajudar", href: "/como-ajudar", children: comoAjudarItems },
  { label: "Contato", href: "/contato" },
];

export const donationHref = "/como-ajudar/doacao";

export const socialLinks = {
  instagram: "https://www.instagram.com/gatosdefrancisca/",
  brecho: "https://www.instagram.com/bazargatosdefrancisca/",
  sebo: "https://www.instagram.com/sebogatosdefrancisca/",
  facebook: "https://www.facebook.com/gatosdefrancisca",
};

// Faixa superior (TopBar)
export const contactInfo = {
  // TODO: trocar pela mensagem definitiva
  tagline: "Resgate, cuidado e adoção responsável de gatinhos",
  whatsappNumber: "+5521987755777",
  whatsappLabel: "(21) 98775-5777",
  /** mensagem que já aparece escrita quando a pessoa abre a conversa pelo site */
  whatsappMessage: "Olá! Vim pelo site do Gatos de Francisca e gostaria de mais informações.",
  pixKey: "095.402.357-90",
};

// Link do WhatsApp que abre a conversa com uma mensagem pronta.
// Ex.: whatsappHref("Olá! Tenho interesse em adotar um gatinho.")
export function whatsappHref(message: string = contactInfo.whatsappMessage) {
  const number = contactInfo.whatsappNumber.replace(/\D/g, ""); // wa.me aceita só números
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const loginHref = "/login"; // área de voluntários (a criar)

export const languages = [
  { code: "pt", label: "PT", name: "Português" },
  { code: "en", label: "EN", name: "English" },
] as const;

// Endereço do gatil: usado nos dados estruturados do Google e na seção de localização.
export const shelterAddress = {
  streetAddress: "Rua Nossa Senhora de Lourdes, 16",
  neighborhood: "Grajaú",
  addressLocality: "Rio de Janeiro",
  addressRegion: "RJ",
  postalCode: "20540-370",
  addressCountry: "BR",
};

// "Rua Nossa Senhora de Lourdes, 16 - Grajaú, Rio de Janeiro - RJ, 20540-370"
export const shelterAddressLine = `${shelterAddress.streetAddress} - ${shelterAddress.neighborhood}, ${shelterAddress.addressLocality} - ${shelterAddress.addressRegion}, ${shelterAddress.postalCode}`;
