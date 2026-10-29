import express, { type ErrorRequestHandler } from "express";
import { sql } from "drizzle-orm";
import { db } from "./db/index.js";
import { catsRouter } from "./routes/cats.js";
import { meRouter } from "./routes/me.js";
import { corsMiddleware } from "./lib/cors.js";

export const app = express();

app.disable("x-powered-by");
app.use(corsMiddleware);
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({ name: "API Gatos de Francisca", docs: "GET /cats, GET /cats/:slug, GET /me, GET /health" });
});

// Verifica se a API e o banco estão no ar (útil para a hospedagem monitorar).
app.get("/health", async (_req, res) => {
  await db.execute(sql`select 1`);
  res.json({ status: "ok" });
});

app.use("/cats", catsRouter);
app.use("/me", meRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Erros inesperados: registra no log e devolve uma mensagem genérica (sem vazar detalhes).
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
};
app.use(errorHandler);

// Na Vercel, este arquivo é o ponto de entrada: ela usa o app exportado por padrão
// (sem app.listen). No computador, quem sobe o servidor é o src/index.ts.
export default app;
