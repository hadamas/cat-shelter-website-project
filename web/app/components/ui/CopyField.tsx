"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/app/components/icons";

// Valor destacado (chave Pix, cupom...) com botão de copiar.
export default function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // sem permissão de clipboard: o texto continua selecionável
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-main-orange/60 bg-main-orange/[0.08] px-4 py-3 text-left">
      <span className="min-w-0">
        <span className="block text-xs text-main-brown/60">{label}</span>
        <span className="block select-all truncate font-bold text-main-brown">{value}</span>
      </span>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-main-blue shadow-sm transition-colors hover:bg-main-blue hover:text-white"
      >
        {copied ? <CheckIcon width={14} height={14} /> : <CopyIcon width={14} height={14} />}
        {copied ? "Copiado!" : "Copiar"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} copiado` : ""}
      </span>
    </div>
  );
}
