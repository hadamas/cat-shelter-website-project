"use client";

import { useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/app/components/icons";

const inputClass =
  "block w-full rounded-xl border border-main-brown/20 bg-white px-4 py-3 text-main-brown placeholder:text-main-brown/35 transition-colors focus:border-main-blue focus:outline-none focus:ring-2 focus:ring-main-blue/20";

export function TextField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-main-brown/70">
        {label}
      </label>
      <input id={id} className={inputClass} {...props} />
    </div>
  );
}

// Campo de senha com botão para mostrar/ocultar o que foi digitado.
export function PasswordField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-main-brown/70">
        {label}
      </label>
      <div className="relative">
        <input id={id} type={visible ? "text" : "password"} className={`${inputClass} pr-12`} {...props} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-main-brown/50 transition-colors hover:text-main-blue"
        >
          {visible ? <EyeOffIcon width={18} height={18} /> : <EyeIcon width={18} height={18} />}
        </button>
      </div>
    </div>
  );
}

export function FormMessage({ type, children }: { type: "error" | "success"; children: React.ReactNode }) {
  return (
    <p
      role={type === "error" ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm ${
        type === "error" ? "bg-[#e2557a]/10 text-[#b3304f]" : "bg-main-blue/10 text-main-blue"
      }`}
    >
      {children}
    </p>
  );
}

export function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-full bg-main-orange px-6 py-3 text-sm font-bold text-main-brown transition-colors hover:bg-main-blue hover:text-white disabled:cursor-wait disabled:opacity-60"
    >
      {loading ? "Aguarde…" : children}
    </button>
  );
}
