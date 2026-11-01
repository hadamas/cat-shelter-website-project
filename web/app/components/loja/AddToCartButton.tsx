"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckIcon, PlusIcon, ShoppingBagIcon } from "@/app/components/icons";
import { currentPrice, hasVariations, type Product } from "@/app/lib/shop";
import { useCart } from "./cart/CartProvider";

// Botão do card: adiciona 1 unidade. No celular vira um "+" redondo.
// Produto com cor/tamanho para escolher: leva à página do produto.
export default function AddToCartButton({ product }: { product: Product }) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(t);
  }, [added]);

  const href = `/lojinha/${product.slug}`;
  const soldOut = product.stock <= 0;
  const inCart = items.filter((i) => i.productId === product.id).reduce((s, i) => s + i.quantity, 0);
  const full = !soldOut && !hasVariations(product) && inCart >= product.stock;

  const desktop =
    "hidden w-full items-center justify-center gap-2 rounded-full px-3 py-2.5 text-xs font-bold transition-colors sm:flex lg:text-sm";
  const mobile = "grid size-9 shrink-0 place-items-center rounded-full transition-colors sm:hidden";

  if (soldOut) {
    return (
      <>
        <span className={`${desktop} cursor-not-allowed bg-main-brown/10 text-main-brown/50`}>Esgotado</span>
        <span className="text-xs font-semibold text-main-brown/50 sm:hidden">Esgotado</span>
      </>
    );
  }

  if (hasVariations(product)) {
    return (
      <>
        <Link href={href} className={`${desktop} bg-main-orange text-main-brown hover:bg-main-blue hover:text-white`}>
          <ShoppingBagIcon width={16} height={16} />
          Escolher opções
        </Link>
        <Link
          href={href}
          aria-label={`Escolher opções de ${product.name}`}
          className={`${mobile} bg-main-orange text-main-brown hover:bg-main-blue hover:text-white`}
        >
          <PlusIcon width={18} height={18} />
        </Link>
      </>
    );
  }

  function handleAdd() {
    const n = add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      photo: product.photos[0]?.src,
      unitPrice: currentPrice(product),
      originalPrice: product.price,
      stock: product.stock,
      limitedEdition: product.limitedEdition,
    });
    if (n > 0) setAdded(true);
  }

  const label = full ? "Máximo na sacola" : added ? "Adicionado!" : "Adicionar à sacola";
  const color = added
    ? "bg-main-blue text-white"
    : "bg-main-orange text-main-brown hover:bg-main-blue hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-main-orange disabled:hover:text-main-brown";

  return (
    <>
      <button type="button" onClick={handleAdd} disabled={full} className={`${desktop} ${color}`}>
        {added ? <CheckIcon width={16} height={16} /> : <ShoppingBagIcon width={16} height={16} />}
        {label}
      </button>
      <button
        type="button"
        onClick={handleAdd}
        disabled={full}
        aria-label={`${label}: ${product.name}`}
        className={`${mobile} ${color}`}
      >
        {added ? <CheckIcon width={18} height={18} /> : <PlusIcon width={18} height={18} />}
      </button>
    </>
  );
}
