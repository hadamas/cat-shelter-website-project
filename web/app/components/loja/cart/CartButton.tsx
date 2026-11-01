"use client";

import { usePathname } from "next/navigation";
import { ShoppingBagIcon } from "@/app/components/icons";
import { useCart } from "./CartProvider";

// Botão redondo fixo no canto inferior esquerdo. Aparece nas páginas da
// Lojinha e, em qualquer página, quando a sacola tem itens.
export default function CartButton() {
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  if (!pathname.startsWith("/lojinha") && count === 0) return null;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={count > 0 ? `Abrir minha sacola (${count} ${count === 1 ? "item" : "itens"})` : "Abrir minha sacola"}
      className="fixed bottom-5 left-5 z-40 grid size-14 place-items-center rounded-full bg-main-blue text-white shadow-lg ring-4 ring-white transition-transform hover:scale-105 hover:bg-main-orange hover:text-main-brown"
    >
      <ShoppingBagIcon width={26} height={26} />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute -right-1 -top-1 grid min-w-6 place-items-center rounded-full bg-main-orange px-1.5 text-xs font-bold leading-6 text-main-brown ring-2 ring-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
