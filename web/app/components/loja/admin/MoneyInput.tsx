"use client";

import { formatBRL } from "@/app/lib/money";
import { inputClass } from "@/app/components/adocao/admin/styles";

// Campo de valor em reais: aceita só números e formata enquanto digita,
// dos centavos para cima (1 → R$ 0,01; 1990 → R$ 19,90; 123456 → R$ 1.234,56).
export default function MoneyInput({
  id,
  value,
  onChange,
  invalid,
  placeholder = "R$ 0,00",
}: {
  id: string;
  /** valor em centavos; null = vazio */
  value: number | null;
  onChange: (cents: number | null) => void;
  invalid?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={value === null ? "" : formatBRL(value)}
      placeholder={placeholder}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 9);
        onChange(digits ? Number(digits) : null);
      }}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={`${inputClass} tabular-nums`}
    />
  );
}
