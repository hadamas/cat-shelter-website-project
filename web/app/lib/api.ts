// Endereço da API (pasta api/ do projeto).
// NEXT_PUBLIC_API_URL é usado pelo navegador (login, painel) e pelo servidor.
// API_URL continua aceito no servidor, por compatibilidade.
export function apiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;
  if (!base) {
    throw new Error(
      "Defina a variável de ambiente NEXT_PUBLIC_API_URL (ex.: http://localhost:3333 no web/.env.local).",
    );
  }
  return `${base.replace(/\/$/, "")}${path}`;
}
