"use client";

import { MinusIcon, PlusIcon } from "@/app/components/icons";

// Botões − e + para escolher a quantidade.
export default function QuantityStepper({
  value,
  max,
  onChange,
  size = "md",
  label = "Quantidade",
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
  label?: string;
}) {
  const btn = size === "sm" ? "size-8" : "size-11";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-full border border-main-brown/20 bg-white">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Diminuir quantidade"
        className={`grid ${btn} place-items-center rounded-full text-main-brown transition-colors hover:text-main-blue disabled:opacity-30`}
      >
        <MinusIcon width={size === "sm" ? 14 : 16} height={size === "sm" ? 14 : 16} />
      </button>
      <span aria-live="polite" className={`min-w-6 text-center font-semibold text-main-brown ${size === "sm" ? "text-sm" : ""}`}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
        className={`grid ${btn} place-items-center rounded-full text-main-brown transition-colors hover:text-main-blue disabled:opacity-30`}
      >
        <PlusIcon width={size === "sm" ? 14 : 16} height={size === "sm" ? 14 : 16} />
      </button>
    </div>
  );
}
