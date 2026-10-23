// Configurações centrais do site: navegação, links e redes sociais.
// Altere aqui e o Header/Footer se atualizam juntos.

export const siteConfig = {
  name: "Gatos de Francisca",
  description:
    "Gatil Gatos de Francisca: resgate, cuidado e adoção responsável de gatinhos. Conheça os gatos disponíveis para adoção e saiba como ajudar.",
};

export type NavItem = { label: string; href: string };

export const comoAjudarItems: NavItem[] = [
  { label: "Adote um gatinho", href: "/#adocao" },
  { label: "Seja voluntário", href: "/#voluntariado" },
  { label: "Lojinha", href: "/#lojinha" },
  { label: "Doações", href: "/#doacao" },
  { label: "Contas", href: "/#contas" },
];

export const navItems: (NavItem & { children?: NavItem[] })[] = [
  { label: "Home", href: "/" },
  { label: "Quem Somos", href: "/#quem-somos" },
  { label: "Como Ajudar", href: "/#como-ajudar", children: comoAjudarItems },
  { label: "Contato", href: "/#contato" },
];

export const donationHref = "/#doacao";

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
  // TODO: preencher com o WhatsApp real (só números, com DDI e DDD, ex.: 5521999999999)
  whatsappNumber: "+5521987755777",
  whatsappLabel: "(21) 98775-5777",
  pixKey: "095.402.357-90",
};

export const loginHref = "/login"; // área de voluntários (a criar)

export const languages = [
  { code: "pt", label: "PT", name: "Português" },
  { code: "en", label: "EN", name: "English" },
] as const;
