"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, LogOutIcon, UserIcon } from "@/app/components/icons";
import { loginHref } from "@/app/lib/site";
import { useAuth } from "./AuthProvider";

const roleLabel = { admin: "Administrador(a)", volunteer: "Voluntário(a)" } as const;

// Ícone de usuário na faixa do topo:
// deslogado → leva ao login | logado → mostra o primeiro nome e um menu com "Sair".
export default function UserMenu() {
  const { status, session, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // fecha ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (status !== "signedIn") {
    return (
      <Link
        href={loginHref}
        prefetch={false}
        aria-label="Entrar na área do voluntário"
        title="Área do voluntário"
        className="grid size-7 place-items-center rounded-full transition-colors hover:bg-main-blue/10 hover:text-main-blue"
      >
        <UserIcon width={15} height={15} />
      </Link>
    );
  }

  const displayName = profile?.name ?? session?.user.email ?? "Conta";
  const firstName = displayName.split(" ")[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-semibold text-main-blue transition-colors hover:bg-main-blue/10"
      >
        <UserIcon width={15} height={15} />
        <span className="max-w-28 truncate">{firstName}</span>
        <ChevronDownIcon width={12} height={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[60] mt-2 w-60 rounded-2xl border border-black/5 bg-white p-2 text-sm shadow-lg"
        >
          <div className="px-3 py-2">
            <p className="truncate font-semibold text-main-brown">{displayName}</p>
            <p className="truncate text-xs text-main-brown/60">{session?.user.email}</p>
            <p
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${
                profile ? "bg-main-blue/10 text-main-blue" : "bg-main-brown/10 text-main-brown/70"
              }`}
            >
              {profile ? roleLabel[profile.role] : "Sem acesso liberado"}
            </p>
          </div>
          <hr className="my-1 border-black/5" />
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-main-brown transition-colors hover:bg-main-orange/15"
          >
            <LogOutIcon width={15} height={15} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
