"use client";

import type { Session } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/app/lib/api";
import { authErrorMessage, getSupabase } from "@/app/lib/supabase";

export type Role = "admin" | "volunteer";
export type Profile = { id: string; name: string; email: string; role: Role };

type AuthState = {
  /** "loading": ainda verificando a sessão salva no navegador */
  status: "loading" | "signedOut" | "signedIn";
  session: Session | null;
  /** dados da nossa API (nome e papel). null = logado, mas sem acesso liberado */
  profile: Profile | null;
  /** true quando a pessoa chegou por um link de redefinição de senha */
  recovery: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  /** token para enviar à API: Authorization: Bearer <token> */
  accessToken: string | null;
};

const AuthContext = createContext<AuthState | null>(null);

// Sem as variáveis do Supabase (ex.: ambiente ainda não configurado), o site
// funciona normalmente, só que sem login.
const authConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

async function fetchProfile(token: string): Promise<Profile | null> {
  try {
    const res = await fetch(apiUrl("/me"), { headers: { Authorization: `Bearer ${token}` } });
    return res.ok ? ((await res.json()) as Profile) : null;
  } catch {
    return null;
  }
}

// Guarda quem está logado e disponibiliza para qualquer componente via useAuth().
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthState["status"]>(authConfigured ? "loading" : "signedOut");
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    if (!authConfigured) {
      console.warn("Login desativado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
      return;
    }
    const supabase = getSupabase();

    let active = true;
    const apply = async (next: Session | null) => {
      if (!active) return;
      setSession(next);
      if (!next) {
        setProfile(null);
        setStatus("signedOut");
        return;
      }
      const p = await fetchProfile(next.access_token);
      if (!active) return;
      setProfile(p);
      setStatus("signedIn");
    };

    supabase.auth.getSession().then(({ data }) => apply(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      // TOKEN_REFRESHED: só atualiza o token, sem buscar o perfil de novo
      if (event === "TOKEN_REFRESHED") setSession(next);
      else if (event !== "INITIAL_SESSION") void apply(next);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await getSupabase().auth.signInWithPassword({ email, password });
      return error ? { error: authErrorMessage(error.message) } : {};
    } catch {
      return { error: "O login está indisponível no momento." };
    }
  }, []);

  const signOut = useCallback(async () => {
    await getSupabase().auth.signOut();
  }, []);

  const value = useMemo<AuthState>(
    () => ({ status, session, profile, recovery, signIn, signOut, accessToken: session?.access_token ?? null }),
    [status, session, profile, recovery, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
