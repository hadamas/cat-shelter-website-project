import { formatBRL } from "@/app/lib/money";

// Textos e configurações da Lojinha.

export const shopIntro = {
  title: "Lojinha",
  subtitle: "Produtos feitos com carinho para quem ama gatos. Toda a renda ajuda a manter o gatil.",
};

/** Limite de caracteres da descrição (o mesmo é conferido na API). */
export const productDescriptionMaxLength = 1000;

/** Limite de fotos por produto (o mesmo é conferido na API). */
export const maxProductPhotos = 8;

/** A partir de quantas unidades restantes aparece o aviso "Últimas unidades". */
export const lowStockThreshold = 3;

export const limitedEditionLabel = "Edição limitada";

/** Quadro "pagamento e entrega" da página do produto. */
export const shopInfo = [
  { title: "Pagamento", text: "Pix ou cartão de crédito." },
  {
    title: "Entrega",
    text: "Combinada pelo WhatsApp depois da compra. Itens de edição limitada também podem ser retirados nos nossos eventos.",
  },
];

/** Opção mostrada quando o produto não tem cores ou tamanhos cadastrados. */
export const singleOptionLabel = "Única";

// Enquanto o pagamento online não fica pronto, "Fechar compra" envia o pedido
// pelo WhatsApp com esta mensagem.
export function cartWhatsappMessage(
  items: { name: string; quantity: number; unitPrice: number; color?: string; size?: string }[],
  total: number,
) {
  const lines = items.map((i) => {
    const options = [i.color && `cor ${i.color}`, i.size && `tamanho ${i.size}`].filter(Boolean).join(", ");
    return `• ${i.quantity}x ${i.name}${options ? ` (${options})` : ""}: ${formatBRL(i.unitPrice * i.quantity)}`;
  });
  return ["Olá! Quero comprar na Lojinha do Gatos de Francisca:", "", ...lines, "", `Total: ${formatBRL(total)}`].join("\n");
}
