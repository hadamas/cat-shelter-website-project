import { z } from "zod";

// Variáveis de ambiente validadas na inicialização:
// se faltar alguma obrigatória, a API nem sobe e mostra o erro claramente.
const schema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL precisa ser uma URL de conexão do Postgres"),
  PORT: z.coerce.number().int().positive().default(3333),
  /** endereços do site que podem chamar a API (separados por vírgula) */
  WEB_ORIGIN: z.string().default("http://localhost:3000"),
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
  webOrigins: parsed.data.WEB_ORIGIN.split(",").map((o) => o.trim()),
};
