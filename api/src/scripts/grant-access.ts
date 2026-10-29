// Dá acesso ao site para uma pessoa (admin ou voluntário).
//
// Uso (na pasta api):
//   npm run users:grant -- <email> "<Nome>" <admin|volunteer>
//   ex.: npm run users:grant -- fulanodetal@gmail.com "Fulano" admin
//
// - Se a pessoa ainda não tem conta no Supabase, envia um CONVITE por e-mail
//   com um link para ela criar a senha (página /redefinir-senha do site).
// - Se já tem conta, só cria/atualiza o papel dela.
//
// Precisa de SUPABASE_SECRET_KEY no api/.env (Supabase > Project Settings > API Keys > Secret keys).
// Essa chave dá acesso total ao projeto: use só no seu computador, nunca no site nem na Vercel.
//
// Usa a API de administração do Supabase Auth diretamente (fetch), sem bibliotecas extras.
import { db, pool } from "../db/index.js";
import { users } from "../db/schema.js";
import { env } from "../env.js";

type AuthUser = { id: string; email?: string };

const [email, name, role] = process.argv.slice(2);

async function authAdmin<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = env.SUPABASE_SECRET_KEY!;
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...init.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (body as { msg?: string; message?: string; error_description?: string }).msg ??
      (body as { message?: string }).message ?? (body as { error_description?: string }).error_description;
    throw new Error(`Supabase respondeu ${res.status}: ${msg ?? JSON.stringify(body)}`);
  }
  return body as T;
}

async function findUserByEmail(target: string) {
  for (let page = 1; ; page++) {
    const { users: list } = await authAdmin<{ users: AuthUser[] }>(`/admin/users?page=${page}&per_page=1000`);
    const found = list.find((u) => u.email?.toLowerCase() === target);
    if (found || list.length < 1000) return found;
  }
}

async function main() {
  if (!email || !name || (role !== "admin" && role !== "volunteer")) {
    throw new Error('Uso: npm run users:grant -- <email> "<Nome>" <admin|volunteer>');
  }
  if (!env.SUPABASE_SECRET_KEY) {
    throw new Error("Defina SUPABASE_SECRET_KEY no api/.env para usar este script.");
  }

  const normalized = email.trim().toLowerCase();
  let authUserId = (await findUserByEmail(normalized))?.id;

  if (authUserId) {
    console.log(`Conta já existe no Supabase: ${normalized}`);
  } else {
    const redirectTo = `${env.SITE_URL.replace(/\/$/, "")}/redefinir-senha`;
    const invited = await authAdmin<AuthUser>(`/invite?redirect_to=${encodeURIComponent(redirectTo)}`, {
      method: "POST",
      body: JSON.stringify({ email: normalized, data: { name } }),
    });
    authUserId = invited.id;
    console.log(`📧 Convite enviado para ${normalized}`);
  }

  await db
    .insert(users)
    .values({ id: authUserId, name, email: normalized, role })
    .onConflictDoUpdate({ target: users.id, set: { name, email: normalized, role } });

  console.log(`✅ ${name} agora tem acesso como ${role === "admin" ? "administrador(a)" : "voluntário(a)"}.`);
}

main()
  .catch((err) => {
    console.error("❌", err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
