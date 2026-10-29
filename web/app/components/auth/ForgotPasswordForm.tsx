"use client";

import Link from "next/link";
import { useState } from "react";
import { authErrorMessage, getSupabase } from "@/app/lib/supabase";
import { FormMessage, SubmitButton, TextField } from "./fields";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email")).trim();
    setLoading(true);
    setError(null);
    try {
      const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });
      if (error) setError(authErrorMessage(error.message));
      else setSent(true);
    } catch {
      setError("O serviço de login está indisponível no momento.");
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="space-y-4">
        {/* mensagem genérica de propósito: não revela se o e-mail tem conta */}
        <FormMessage type="success">
          Se este e-mail tiver uma conta, você vai receber um link para criar uma nova senha. Confira também a caixa de spam.
        </FormMessage>
        <Link href="/login" className="block text-center text-sm font-semibold text-main-blue hover:underline">
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && <FormMessage type="error">{error}</FormMessage>}
      <TextField label="E-mail" name="email" type="email" autoComplete="email" required placeholder="seu@email.com" />
      <SubmitButton loading={loading}>Enviar link</SubmitButton>
      <Link href="/login" className="block text-center text-sm font-semibold text-main-blue hover:underline">
        Voltar para o login
      </Link>
    </form>
  );
}
