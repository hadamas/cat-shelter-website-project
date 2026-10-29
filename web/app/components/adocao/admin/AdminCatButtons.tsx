"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { PencilIcon, PlusIcon } from "@/app/components/icons";
import type { Cat } from "@/app/lib/cats";
import CatFormModal from "./CatFormModal";

const LIST_PATH = "/como-ajudar/adote";

/** Token de quem está logado, só se for admin (senão os botões não aparecem). */
function useAdminToken() {
  const { profile, accessToken } = useAuth();
  return profile?.role === "admin" ? accessToken : null;
}

// Botão "Cadastrar gatinho" (topo da listagem). Só aparece para admins.
export function AddCatButton() {
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
        Cadastrar gatinho
      </button>
      {open && (
        <CatFormModal
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

// Botão de editar um gatinho: no card (ícone de lápis) ou na página do gato.
export function EditCatButton({ cat, variant = "icon" }: { cat: Cat; variant?: "icon" | "full" }) {
  const token = useAdminToken();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  if (!token) return null;

  function handleSaved(saved: Cat) {
    setOpen(false);
    if (variant === "full") {
      // na página do gato: se ele foi adotado, volta para a listagem;
      // se o nome mudou, o endereço da página muda junto
      if (saved.status === "adotado") return router.push(LIST_PATH);
      if (saved.slug !== cat.slug) return router.replace(`${LIST_PATH}/${saved.slug}`);
    }
    router.refresh();
  }

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Editar ${cat.name}`}
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
      {open && <CatFormModal cat={cat} token={token} onClose={() => setOpen(false)} onSaved={handleSaved} />}
    </>
  );
}
