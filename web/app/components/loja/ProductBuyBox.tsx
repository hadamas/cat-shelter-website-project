"use client";

import { useEffect, useId, useState } from "react";
import { CheckIcon, ShoppingBagIcon } from "@/app/components/icons";
import { lowStockThreshold } from "@/app/content/lojinha";
import { currentPrice, type Product } from "@/app/lib/shop";
import QuantityStepper from "./QuantityStepper";
import { cartKey, useCart } from "./cart/CartProvider";

// Escolha de cor/tamanho, quantidade e "Adicionar à sacola" na página do produto.
export default function ProductBuyBox({ product }: { product: Product }) {
  const uid = useId();
  const { add, items, setOpen } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  const soldOut = product.stock <= 0;
  const inCart = items.find((i) => i.key === cartKey(product.id, color, size))?.quantity ?? 0;
  const available = Math.max(0, product.stock - inCart);

  function handleAdd() {
    const n = add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        photo: product.photos[0]?.src,
        unitPrice: currentPrice(product),
        originalPrice: product.price,
        color,
        size,
        stock: product.stock,
        limitedEdition: product.limitedEdition,
      },
      quantity,
    );
    if (n > 0) {
      setAdded(true);
      setQuantity(1);
    }
  }

  const select =
    "w-full cursor-pointer rounded-xl border border-main-brown/20 bg-white px-4 py-3 font-semibold text-main-brown transition-colors hover:border-main-blue focus:border-main-blue focus:outline-none";

  return (
    <div className="space-y-5">
      {(product.colors.length > 0 || product.sizes.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {product.colors.length > 0 && (
            <div>
              <label htmlFor={`${uid}-cor`} className="mb-1.5 block text-xs font-semibold text-main-brown/70">
                Cor
              </label>
              <select id={`${uid}-cor`} value={color} onChange={(e) => setColor(e.target.value)} className={select}>
                {product.colors.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
          {product.sizes.length > 0 && (
            <div>
              <label htmlFor={`${uid}-tamanho`} className="mb-1.5 block text-xs font-semibold text-main-brown/70">
                Tamanho
              </label>
              <select id={`${uid}-tamanho`} value={size} onChange={(e) => setSize(e.target.value)} className={select}>
                {product.sizes.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {soldOut ? (
        <p className="rounded-2xl bg-main-brown/[0.06] px-4 py-3 text-center font-semibold text-main-brown/70">
          Produto esgotado no momento
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <QuantityStepper value={quantity} max={Math.max(1, available)} onChange={setQuantity} />
            <button
              type="button"
              onClick={handleAdd}
              disabled={available === 0}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                added ? "bg-main-blue text-white" : "bg-main-orange text-main-brown hover:bg-main-blue hover:text-white"
              }`}
            >
              {added ? <CheckIcon width={18} height={18} /> : <ShoppingBagIcon width={18} height={18} />}
              {available === 0 ? "Máximo na sacola" : added ? "Adicionado à sacola!" : "Adicionar à sacola"}
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {product.stock <= lowStockThreshold ? (
              <span className="font-semibold text-shop-sale">
                {product.stock === 1 ? "Última unidade!" : `Últimas ${product.stock} unidades!`}
              </span>
            ) : (
              <span />
            )}
            {added && (
              <button type="button" onClick={() => setOpen(true)} className="font-semibold text-main-blue hover:underline">
                Ver minha sacola →
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
