"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, PixIcon } from "./icons";

// Único pedaço da TopBar que precisa de JavaScript: copiar a chave Pix.
export default function CopyPix({ pixKey }: { pixKey: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // navegador sem permissão de clipboard: o usuário ainda pode selecionar o texto
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copiar chave Pix"
      className="inline-flex items-center gap-1.5 rounded px-1 transition-colors hover:text-main-blue"
    >
      <PixIcon width={14} height={14} />
      <span>
        Pix: <span className="font-semibold select-all">{pixKey}</span>
      </span>
      {copied ? (
        <CheckIcon width={14} height={14} className="text-main-blue" />
      ) : (
        <CopyIcon width={14} height={14} className="opacity-60" />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? "Chave Pix copiada" : ""}
      </span>
    </button>
  );
}
