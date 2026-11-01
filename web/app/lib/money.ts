// Valores em dinheiro são guardados em CENTAVOS (R$ 25,90 = 2590), como a
// InfinitePay também usa. Assim não há erros de arredondamento com vírgula.

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 2590 → "R$ 25,90" */
export const formatBRL = (cents: number) => brl.format(cents / 100);

/** Percentual de desconto arredondado: 5000 → 4000 = 20 */
export const discountPercent = (price: number, salePrice: number) => Math.round((1 - salePrice / price) * 100);
