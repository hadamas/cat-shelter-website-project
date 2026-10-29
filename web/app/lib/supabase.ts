import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente do Supabase usado NO NAVEGADOR (login, logout, redefinir senha).
// Usa a chave "publishable", que é pública por natureza: ela só permite o que o
// Supabase Auth libera. Os dados do site são protegidos pela nossa API.
let client: SupabaseClient | null = null;

export function getSupabase() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no web/.env.local.");
  }
  // usa só o endereço base, mesmo que a URL tenha sido colada com /rest/v1/ no final
  client = createClient(new URL(url).origin, key, {
    auth: {
      persistSession: true, // mantém a pessoa logada ao fechar e abrir o site
      autoRefreshToken: true, // renova o token antes de expirar
      detectSessionInUrl: true, // lê o login vindo dos links de e-mail (convite, redefinir senha)
      flowType: "implicit",
    },
  });
  return client;
}

// Traduz as mensagens de erro mais comuns do Supabase Auth.
export function authErrorMessage(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail pelo link que enviamos antes de entrar.";
  if (m.includes("rate limit") || m.includes("too many")) return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
  if (m.includes("should be different")) return "A nova senha precisa ser diferente da atual.";
  if (m.includes("password should be at least")) return "A senha precisa ter pelo menos 8 caracteres.";
  if (m.includes("weak")) return "Escolha uma senha mais forte (misture letras, números e símbolos).";
  return "Não foi possível concluir. Tente novamente em instantes.";
}
