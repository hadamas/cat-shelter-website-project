// Conteúdo da página Quem Somos.
// Assim como a Home, tudo aqui virará dados do banco, editáveis pelos admins.
// Imagens: coloque os arquivos em /public/images/... e use o caminho a partir de "/images".

import type { CtaLink } from "./home";

export type ImageRef = { src: string; alt: string };

// ---------- Hero ----------
export const hero = {
  title: "Cuidado que transforma vidas",
  subtitle:
    "O nosso gatil acolhe gatos em situação de vulnerabilidade no Rio de Janeiro, oferecendo cuidados, proteção e a oportunidade de encontrar uma família para a vida toda.",
  cta: { label: "Quero ajudar", href: "/como-ajudar" } satisfies CtaLink,
};

// ---------- Parceiros ----------
export type Partner = {
  name: string;
  logo?: ImageRef & { width: number; height: number };
  href?: string;
};

export const partners = {
  title: "Quem caminha com a gente",
  items: [
    {
      name: "Petz",
      logo: { src: "/images/parceiros/petz.png", alt: "Petz", width: 740, height: 164 },
      href: "https://www.petz.com.br/parceiro/gdf?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAactRvgpnSrXt6Vga4dvJQdeqOl5CsUxfY325JYnm5imPCKIW8xEaRffsDezgQ_aem_AiiyigfD_70Yzl7iP8bNRA&utm_id=97760_v0_s00_e0_tv3_a1dennh9x4pi1v",
    },
    {
      name: "Ágape Clínica Veterinária & Pet Hostel",
      logo: { src: "/images/parceiros/agape.png", alt: "Ágape Clínica Veterinária & Pet Hostel", width: 185, height: 200 },
      href: "https://agapeclinicaveterinaria.flyvet.com.br/"
    },
    {
      name: "Cigavet",
      logo: { src: "/images/parceiros/cigavet.png", alt: "Cigavet", width: 451, height: 200 },
      href: "https://cigavet.com.br/"
    },
  ] satisfies Partner[],
};

// ---------- Cards "como ajudar" ----------
export type HelpCard = {
  icon: "donate" | "sponsor" | "adopt";
  title: string;
  text: string;
  cta: CtaLink;
};

export const helpCards: HelpCard[] = [
  {
    icon: "donate",
    title: "Faça uma doação",
    text: "Seja com uma doação pontual ou recorrente, qualquer valor ajuda a manter ração, areia, vacinas e cuidados veterinários para todos os nossos gatinhos.",
    cta: { label: "Quero doar", href: "/como-ajudar/doacao" },
  },
  {
    icon: "sponsor",
    title: "Apadrinhe um gatinho",
    text: "Escolha um gatinho e contribua todo mês com os custos dele. Você acompanha a vida do seu afilhado até ele encontrar um lar.",
    cta: { label: "Quero apadrinhar", href: "/como-ajudar/doacao#apadrinhe" },
  },
  {
    icon: "adopt",
    title: "Não compre, adote",
    text: "Adotar combate o abandono e abre espaço para que mais gatos sejam resgatados. Ao adotar, você salva duas vidas: a de quem vai e a de quem chega.",
    cta: { label: "Quero adotar", href: "/como-ajudar/adote" },
  },
];

// ---------- Nossa história ----------
export const story = {
  title: "Nossa história",
  paragraphs: [
    "O Gatos de Francisca nasceu em 2019, do desejo de mudar a realidade dos gatos em situação de rua no Rio de Janeiro. O que começou com alguns resgates se transformou em um gatil que hoje acolhe dezenas de gatinhos.",
    "Recebemos filhotes, gatos doentes, feridos ou abandonados. Cada um passa por cuidados veterinários, vacinação e castração antes de seguir para um novo lar.",
    "Também contamos com uma rede de lares temporários, que abrem suas casas para gatinhos que precisam de mais atenção enquanto esperam pela família definitiva.",
  ],
  /** fotos que se alternam com efeito de fade */
  images: [
    { src: "/images/quem-somos/historia-1.jpg", alt: "Gatinho rajado dentro de uma caixa de transporte" },
    { src: "/images/quem-somos/historia-2.jpg", alt: "Gata escura de olhos verdes olhando para a câmera" },
    { src: "/images/quem-somos/historia-3.jpg", alt: "Dois gatinhos brancos e laranja deitados em uma almofada vermelha" },
    { src: "/images/quem-somos/historia-4.jpg", alt: "Gato rajado descansando em um recinto do gatil" },
    { src: "/images/quem-somos/historia-5.jpg", alt: "Voluntária segurando um gato branco no colo" },
  ] satisfies ImageRef[],
  intervalMs: 5000,
};

// ---------- Números ----------
export type Stat = {
  icon: "calendar" | "cat" | "health";
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export const stats: Stat[] = [
  { icon: "calendar", value: 7, label: "anos de gatil" },
  { icon: "cat", value: 300, prefix: "+", label: "gatinhos acolhidos" },
  { icon: "health", value: 100, suffix: "%", label: "castrados" },
];

// ---------- Histórias de gatinhos ----------
export type CatStory = {
  name: string;
  photo: ImageRef;
  story: string;
  status?: "adotado" | "disponível";
};

export const catStories = {
  title: "Conheça algumas histórias",
  subtitle: "Cada gatinho que passa por aqui tem uma trajetória única. Estas são algumas delas.",
  // TODO: trocar pelos gatinhos reais (nome, foto em /public/images/gatinhos e um resumo da história)
  items: [
    {
      name: "Nome do gatinho",
      photo: { src: "/images/quem-somos/historia-1.jpg", alt: "Gatinho rajado" },
      story: "Resumo da história: como foi resgatado, como se recuperou e onde está hoje.",
      status: "adotado",
    },
    {
      name: "Nome da gatinha",
      photo: { src: "/images/quem-somos/historia-2.jpg", alt: "Gata escura de olhos verdes" },
      story: "Resumo da história: como foi resgatada, como se recuperou e onde está hoje.",
      status: "disponível",
    },
    {
      name: "Nome dos irmãos",
      photo: { src: "/images/quem-somos/historia-3.jpg", alt: "Dois gatinhos brancos e laranja" },
      story: "Resumo da história: como foram resgatados, como se recuperaram e onde estão hoje.",
      status: "adotado",
    },
    {
      name: "Nome do gatinho",
      photo: { src: "/images/quem-somos/historia-5.jpg", alt: "Gato branco no colo de uma voluntária" },
      story: "Resumo da história: como foi resgatado, como se recuperou e onde está hoje.",
      status: "disponível",
    },
  ] satisfies CatStory[],
  cta: { label: "Ver gatinhos para adoção", href: "/como-ajudar/adote" } satisfies CtaLink,
};

// ---------- Voluntários ----------
export const volunteers = {
  title: "Nossos voluntários",
  subtitle:
    "Nada disso seria possível sem as pessoas que doam seu tempo e carinho todos os dias. Conheça quem faz o Gatos de Francisca acontecer.",
  // Fotos em /public/images/voluntarios. Enquanto a lista estiver vazia, aparecem espaços reservados.
  // Use apenas fotos com autorização de cada voluntário.
  photos: [] as ImageRef[],
  cta: { label: "Quero ser voluntário", href: "/como-ajudar/voluntariado" } satisfies CtaLink,
};
