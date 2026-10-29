import { z } from "zod";

// Variáveis de ambiente validadas na inicialização:
// se faltar alguma obrigatória, a API nem sobe e mostra o erro claramente.
const schema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL precisa ser uma URL de conexão do Postgres"),
  PORT: z.coerce.number().int().positive().default(3333),
  /** máximo de conexões abertas com o banco (use um número baixo em hospedagem serverless) */
  DB_POOL_MAX: z.coerce.number().int().positive().default(10),
  /**
   * Endereços do site que podem chamar a API pelo navegador (separados por vírgula).
   * Aceita * como curinga, ex.: https://cat-shelter-website-project-*.vercel.app
   */
  WEB_ORIGIN: z.string().default("http://localhost:3000"),
  /** URL do projeto Supabase (ex.: https://xxxx.supabase.co) — usada para validar os logins */
  SUPABASE_URL: z.string().url("SUPABASE_URL precisa ser a URL do projeto Supabase"),
  /** só para projetos Supabase antigos com "JWT Secret" (HS256). Projetos novos não precisam. */
  SUPABASE_JWT_SECRET: z.string().optional(),
  /** chave secreta do Supabase: usada SÓ pelos scripts no seu computador (nunca na Vercel) */
  SUPABASE_SECRET_KEY: z.string().optional(),
  /** endereço do site, usado no link dos convites (scripts). Ex.: https://gatosdefrancisca.vercel.app */
  SITE_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Variáveis de ambiente inválidas:");
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = {
  ...parsed.data,
  // usa só o endereço base (ex.: https://xxxx.supabase.co), mesmo que tenham colado
  // a URL com /rest/v1/ ou outro caminho no final
  SUPABASE_URL: new URL(parsed.data.SUPABASE_URL).origin,
  webOrigins: parsed.data.WEB_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean),
};
