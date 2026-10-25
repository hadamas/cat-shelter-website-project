// Conteúdo da Home.
// Por enquanto fica neste arquivo; depois virá do banco de dados e será
// editável pelos admins. Os componentes só leem estes dados — por isso
// a troca para o banco não muda nada no visual.

export type CtaLink = { label: string; href: string };

export type HeroContent = {
  title: string;
  /** emoji decorativo exibido após o título (ignorado por leitores de tela) */
  titleEmoji?: string;
  subtitle: string;
  media: {
    video: string;
    poster: string;
    alt: string;
  };
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
};

export const hero: HeroContent = {
  title: "Toda vida merece uma nova chance",
  titleEmoji: "🐾",
  subtitle:
    "O Gatos de Francisca resgata, cuida e busca lares responsáveis para gatos que precisam de uma família. Com você, podemos transformar ainda mais histórias.",
  media: {
    video: "/videos/hero.mp4",
    poster: "/videos/hero-poster.webp",
    alt: "Gatinho cinza deitado no gatil, olhando para a câmera",
  },
  primaryCta: { label: "Quero adotar", href: "/como-ajudar/adote" },
  secondaryCta: { label: "Como ajudar", href: "/como-ajudar" },
};
