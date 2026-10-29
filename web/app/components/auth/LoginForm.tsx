"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { FormMessage, PasswordField, SubmitButton, TextField } from "./fields";

// Para onde ir depois do login: ?next=/caminho (só caminhos internos do site).
function nextPath() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export default function LoginForm() {
  const { status, profile, session, signIn, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "signedIn") {
    return (
      <div className="space-y-4">
        <FormMessage type="success">
          Você já está conectado(a) como <strong>{profile?.name ?? session?.user.email}</strong>.
        </FormMessage>
        <div className="flex gap-3">
          <Link href="/" className="flex-1 rounded-full bg-main-orange px-6 py-3 text-center text-sm font-bold text-main-brown hover:bg-main-blue hover:text-white">
            Ir para o site
          </Link>
          <button type="button" onClick={() => signOut()} className="flex-1 rounded-full border border-main-brown/20 px-6 py-3 text-sm font-bold text-main-brown hover:border-main-blue hover:text-main-blue">
            Sair
          </button>
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError(null);
    const result = await signIn(String(form.get("email")).trim(), String(form.get("password")));
    setLoading(false);
    if (result.error) setError(result.error);
    else router.replace(nextPath());
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      {error && <FormMessage type="error">{error}</FormMessage>}
      <TextField label="E-mail" name="email" type="email" autoComplete="email" required placeholder="seu@email.com" />
      <div>
        <PasswordField label="Senha" name="password" autoComplete="current-password" required />
        <div className="mt-2 text-right">
          <Link href="/esqueci-senha" className="text-sm font-semibold text-main-blue hover:underline">
            Esqueci minha senha
          </Link>
        </div>
      </div>
      <SubmitButton loading={loading || status === "loading"}>Entrar</SubmitButton>
    </form>
  );
}
