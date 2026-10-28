// Conteúdo da página Doações (depois virá do banco, editável pelos admins).
import { contactInfo, socialLinks } from "@/app/lib/site";

export type DonationCard = {
  id: string;
  icon: "pix" | "monthly" | "box" | "bag" | "shirt" | "book";
  title: string;
  description: string;
  /** lista de itens aceitos */
  items?: string[];
  /** valor com botão de copiar (chave Pix, cupom) */
  copy?: { label: string; value: string };
  /** botão de ação. Sem `href`, aparece o aviso `soon`. */
  cta?: { label: string; href?: string; whatsappMessage?: string };
  soon?: string;
};

export const intro = {
  title: "Doações",
  subtitle:
    "Toda ajuda faz diferença: ela vira ração, remédios, castrações e cuidados para dezenas de gatinhos. Escolha a forma de doar que for melhor para você.",
};

export const cardsHeading = {
  title: "Escolha como doar",
  subtitle: "Dinheiro, itens, roupas, livros ou até as suas compras: tudo ajuda a manter o gatil.",
};

export const cards: DonationCard[] = [
  {
    id: "pix",
    icon: "pix",
    title: "Doação por Pix",
    description: "Faça uma doação pontual de qualquer valor. É rápido e ajuda nas despesas do dia a dia do gatil.",
    copy: { label: "Chave Pix (CPF)", value: contactInfo.pixKey },
  },
  {
    // âncora usada pelo card "Apadrinhe um gatinho" da página Quem Somos (/como-ajudar/doacao#apadrinhe)
    id: "apadrinhe",
    icon: "monthly",
    title: "Contribuição mensal",
    description:
      "Contribua todo mês com um valor fixo. Com uma ajuda que se repete, conseguimos planejar os cuidados dos gatinhos com mais segurança.",
    // TODO: adicionar o link da contribuição mensal em `href`
    cta: { label: "Quero contribuir todo mês" },
    soon: "Em breve! Enquanto isso, fale com a gente pelo WhatsApp.",
  },
  {
    id: "itens",
    icon: "box",
    title: "Doação de itens",
    description: "Itens que usamos todos os dias e que sempre precisam ser repostos:",
    items: ["Ração", "Sachês e petiscos (como Churu)", "Jornais", "Tapetes higiênicos", "Medicamentos, como vermífugos"],
    cta: {
      label: "Combinar a entrega",
      whatsappMessage: "Olá! Vim pelo site do Gatos de Francisca e gostaria de doar alguns itens. Como posso entregar?",
    },
  },
  {
    id: "petz",
    icon: "bag",
    title: "Compre na Petz",
    description:
      "Comprando pelo nosso link de parceiro, a Petz repassa ao gatil uma parte do valor das suas compras. E você ainda ganha 10% de desconto.",
    copy: { label: "Cupom de 10% OFF", value: "GDF" },
    cta: { label: "Comprar na Petz", href: "https://www.petz.com.br/parceiro/gdf" },
  },
  {
    id: "brecho",
    icon: "shirt",
    title: "Brechó",
    description:
      "Doe roupas e sapatos em bom estado. Tudo é vendido no nosso brechó e o valor arrecadado vai para os cuidados dos gatinhos.",
    cta: { label: "Conhecer o brechó", href: socialLinks.brecho },
  },
  {
    id: "sebo",
    icon: "book",
    title: "Sebo de livros",
    description: "Doe livros que você já leu. Eles ganham novos leitores no nosso sebo e a renda ajuda o gatil.",
    cta: { label: "Conhecer o sebo", href: socialLinks.sebo },
  },
];

export const howToSend = {
  title: "Como enviar a sua doação?",
  text: "Para doar itens, roupas ou livros, fale com a gente pelo WhatsApp ou pelo Instagram e combinamos a melhor forma de entrega.",
  whatsappMessage: "Olá! Vim pelo site do Gatos de Francisca e gostaria de saber como enviar uma doação.",
};
