"use client";

import { useState } from "react";
import { InfoIcon } from "@/app/components/icons";
import { labelClass } from "./styles";

// Rótulo + campo + mensagem de erro, com dica opcional (ícone "i").
export function Field({
  id,
  label,
  hint,
  error,
  children,
  as = "label",
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  /** "legend" para grupos de opções (sexo, status) */
  as?: "label" | "legend";
}) {
  const labelContent = (
    <>
      {label}
      {hint && <InfoTooltip text={hint} label={`Sobre ${label}`} />}
    </>
  );

  const errorMessage = error && (
    <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-[#b3304f]">
      {error}
    </p>
  );

  if (as === "legend") {
    return (
      <fieldset aria-describedby={error ? `${id}-error` : undefined}>
        <legend className={labelClass}>{labelContent}</legend>
        {children}
        {errorMessage}
      </fieldset>
    );
  }

  return (
    <div>
      <div className={labelClass}>
        <label htmlFor={id}>{label}</label>
        {hint && <InfoTooltip text={hint} label={`Sobre ${label}`} />}
      </div>
      {children}
      {errorMessage}
    </div>
  );
}

// Dica que aparece ao passar o mouse, focar com o teclado ou tocar no ícone.
export function InfoTooltip({ text, label }: { text: string; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="group relative inline-flex" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        className="grid place-items-center rounded-full text-main-blue/70 transition-colors hover:text-main-blue focus-visible:outline-2 focus-visible:outline-main-blue"
      >
        <InfoIcon width={15} height={15} />
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-60 -translate-x-1/2 rounded-xl bg-main-brown px-3 py-2 text-xs font-normal leading-relaxed text-white shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {text}
      </span>
    </span>
  );
}
