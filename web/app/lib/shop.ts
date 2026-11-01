// Tipos e funções da Lojinha que podem rodar no navegador e no servidor.

export type ProductPhoto = { src: string; alt: string };

export type Product = {
  id: string;
  /** usado no endereço da página: /lojinha/{slug} */
  slug: string;
  name: string;
  description: string;
  /** preço em centavos */
  price: number;
  /** preço promocional em centavos; null = sem promoção */
  salePrice: number | null;
  limitedEdition: boolean;
  /** opções de cor; lista vazia = cor única */
  colors: string[];
  /** opções de tamanho; lista vazia = tamanho único */
  sizes: string[];
  /** quantidade disponível; 0 = esgotado */
  stock: number;
  /** a primeira foto é a principal */
  photos: ProductPhoto[];
};

/** Preço que o comprador paga (com promoção, se houver). */
export const currentPrice = (p: Pick<Product, "price" | "salePrice">) => p.salePrice ?? p.price;

/** Tem cor ou tamanho para escolher? Então o "adicionar" leva à página do produto. */
export const hasVariations = (p: Pick<Product, "colors" | "sizes">) => p.colors.length > 0 || p.sizes.length > 0;
