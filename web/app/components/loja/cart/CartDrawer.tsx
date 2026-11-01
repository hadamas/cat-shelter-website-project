"use client";

/* eslint-disable @next/next/no-img-element -- miniaturas pequenas, de várias origens */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ShoppingBagIcon, TrashIcon, WhatsappIcon, XIcon } from "@/app/components/icons";
import { cartWhatsappMessage } from "@/app/content/lojinha";
import { formatBRL } from "@/app/lib/money";
import { whatsappHref } from "@/app/lib/site";
import QuantityStepper from "../QuantityStepper";
import { useCart } from "./CartProvider";

// Aba lateral "Minha sacola".
export default function CartDrawer() {
  const { items, total, open, setOpen, setQuantity, remove } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
    const root = document.documentElement;
    root.style.overflow = open ? "hidden" : "";
  }, [open]);

  const savings = items.reduce((sum, i) => sum + (i.originalPrice - i.unitPrice) * i.quantity, 0);

  // Até o pagamento online ficar pronto, o pedido é enviado pelo WhatsApp.
  const checkoutHref = whatsappHref(cartWhatsappMessage(items, total));

  return (
    <dialog
      ref={dialogRef}
      aria-label="Minha sacola"
      tabIndex={-1}
      onClose={() => setOpen(false)}
      onClick={(e) => e.target === dialogRef.current && setOpen(false)}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-md bg-white p-0 text-main-brown shadow-2xl outline-none backdrop:bg-main-brown/40 open:flex open:animate-[slideInRight_.25s_ease-out] open:flex-col"
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-main-orange/20 px-5 py-4">
        <h2 className="text-3xl text-main-blue">Minha sacola</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fechar sacola"
          className="grid size-10 place-items-center rounded-full text-main-brown/60 transition-colors hover:bg-main-orange/15 hover:text-main-brown"
        >
          <XIcon width={22} height={22} />
        </button>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-auto flex-col items-center justify-center gap-4 px-6 text-center">
          <ShoppingBagIcon width={48} height={48} className="text-main-orange" />
          <p className="text-main-brown/70">Sua sacola está vazia.</p>
          <Link
            href="/lojinha"
            onClick={() => setOpen(false)}
            className="rounded-full bg-main-orange px-6 py-3 text-sm font-bold text-main-brown transition-colors hover:bg-main-blue hover:text-white"
          >
            Ver produtos
          </Link>
        </div>
      ) : (
        <>
          <ul className="min-h-0 flex-auto divide-y divide-main-orange/15 overflow-y-auto overscroll-contain px-5">
            {items.map((item) => {
              const options = [item.color && `Cor: ${item.color}`, item.size && `Tamanho: ${item.size}`].filter(Boolean);
              return (
                <li key={item.key} className="flex gap-3 py-4">
                  <Link
                    href={`/lojinha/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="size-20 shrink-0 overflow-hidden rounded-xl bg-main-orange/10"
                    tabIndex={-1}
                  >
                    {item.photo && <img src={item.photo} alt="" className="size-full object-cover" />}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/lojinha/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-sm font-semibold hover:text-main-blue"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(item.key)}
                        aria-label={`Remover ${item.name} da sacola`}
                        className="grid size-8 shrink-0 place-items-center rounded-full text-main-brown/50 transition-colors hover:bg-[#e2557a]/10 hover:text-[#b3304f]"
                      >
                        <TrashIcon width={16} height={16} />
                      </button>
                    </div>
                    {options.length > 0 && <p className="text-xs text-main-brown/60">{options.join(" · ")}</p>}
                    <p className="text-xs text-main-brown/60">
                      {item.unitPrice < item.originalPrice && (
                        <s className="mr-1">{formatBRL(item.originalPrice)}</s>
                      )}
                      {formatBRL(item.unitPrice)} cada
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <QuantityStepper
                        size="sm"
                        value={item.quantity}
                        max={item.stock}
                        onChange={(q) => setQuantity(item.key, q)}
                        label={`Quantidade de ${item.name}`}
                      />
                      <span className="font-bold">{formatBRL(item.unitPrice * item.quantity)}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <footer className="shrink-0 space-y-3 border-t border-main-orange/20 px-5 py-4">
            {savings > 0 && (
              <p className="flex justify-between text-sm text-shop-sale">
                <span>Você economiza</span>
                <span className="font-semibold">{formatBRL(savings)}</span>
              </p>
            )}
            <p className="flex items-baseline justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold">{formatBRL(total)}</span>
            </p>
            <a
              href={checkoutHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-main-orange px-6 py-3.5 text-sm font-bold text-main-brown transition-colors hover:bg-main-blue hover:text-white"
            >
              <WhatsappIcon width={18} height={18} />
              Fechar compra
            </a>
            <p className="text-center text-[11px] text-main-brown/50">
              Você será levado ao WhatsApp para combinar pagamento e entrega.
            </p>
          </footer>
        </>
      )}
    </dialog>
  );
}
