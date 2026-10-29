"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authErrorMessage, getSupabase } from "@/app/lib/supabase";
import { useAuth } from "./AuthProvider";
import { FormMessage, PasswordField, SubmitButton } from "./fields";

// Usada em dois casos: link de "esqueci minha senha" e link de CONVITE (primeiro acesso).
// O Supabase coloca a sessão no endereço do link; o AuthProvider a lê automaticamente.
export default function ResetPasswordForm() {
  const { status } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (status === "loading") return <p className="text-sm text-main-brown/70">Verificando o link…</p>;

  if (status === "signedOut" && !done) {
    return (
      <div className="space-y-4">
        <FormMessage type="error">Este link é inválido ou expirou. Peça um novo link para criar sua senha.</FormMessage>
        <Link href="/esqueci-senha" className="block text-center text-sm font-semibold text-main-blue hover:underline">
          Pedir novo link
        </Link>
      </div>
    );
  }

  if (done) {
    return <FormMessage type="success">Senha salva! Redirecionando para o site…</FormMessage>;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    if (password.length < 8) return setError("A senha precisa ter pelo menos 8 caracteres.");
    if (password !== String(form.get("confirm"))) return setError("As senhas não são iguais.");

    setLoading(true);
    setError(null);
    const { error } = await getSupabase().auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(authErrorMessage(error.message));
    setDone(true);
    setTimeout(() => router.replace("/"), 1500);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && <FormMessage type="error">{error}</FormMessage>}
      <PasswordField label="Nova senha" name="password" autoComplete="new-password" required minLength={8} />
      <PasswordField label="Confirme a nova senha" name="confirm" autoComplete="new-password" required minLength={8} />
      <p className="text-xs text-main-brown/60">Use pelo menos 8 caracteres, misturando letras e números.</p>
      <SubmitButton loading={loading}>Salvar senha</SubmitButton>
    </form>
  );
}
