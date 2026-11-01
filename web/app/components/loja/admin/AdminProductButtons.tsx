"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { PencilIcon, PlusIcon } from "@/app/components/icons";
import type { Product } from "@/app/lib/shop";
import ProductFormModal from "./ProductFormModal";

const SHOP_PATH = "/lojinha";

function useAdminToken() {
  const { profile, accessToken } = useAuth();
  return profile?.role === "admin" ? accessToken : null;
}

// Botão "Cadastrar produto" (topo da Lojinha). Só aparece para admins.
export function AddProductButton() {
  const token = useAdminToken();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  if (!token) return null;

  return (
    <div className="mb-6 flex justify-end">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-main-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-main-orange hover:text-main-brown"
      >
        <PlusIcon width={18} height={18} />
        Cadastrar produto
      </button>
      {open && (
        <ProductFormModal
          token={token}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

// Editar (e excluir) um produto: lápis no card ou botão na página do produto.
export function EditProductButton({ product, variant = "icon" }: { product: Product; variant?: "icon" | "full" }) {
  const token = useAdminToken();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  if (!token) return null;

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Editar ${product.name}`}
          title="Editar"
          className="absolute right-2 top-2 z-10 grid size-9 place-items-center rounded-full bg-white/95 text-main-brown shadow-md transition-colors hover:bg-main-blue hover:text-white"
        >
          <PencilIcon width={16} height={16} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-main-blue px-4 py-2 text-sm font-bold text-main-blue transition-colors hover:bg-main-blue hover:text-white"
        >
          <PencilIcon width={15} height={15} />
          Editar
        </button>
      )}
      {open && (
        <ProductFormModal
          product={product}
          token={token}
          onClose={() => setOpen(false)}
          onSaved={(saved) => {
            setOpen(false);
            if (variant === "full" && saved.slug !== product.slug) return router.replace(`${SHOP_PATH}/${saved.slug}`);
            router.refresh();
          }}
          onDeleted={() => {
            setOpen(false);
            if (variant === "full") return router.push(SHOP_PATH);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
