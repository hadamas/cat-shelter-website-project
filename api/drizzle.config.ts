import { defineConfig } from "drizzle-kit";

// Carrega o arquivo .env (Node 20.12+), se existir.
try {
  process.loadEnvFile();
} catch {
  // sem .env: usa as variáveis já definidas no ambiente
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle", // migrations em SQL, versionadas no git
  dbCredentials: { url: process.env.DATABASE_URL! },
});
