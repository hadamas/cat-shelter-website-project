import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { sql } from "drizzle-orm";
import { db } from "./db/index.js";
import { env } from "./env.js";
import { catsRouter } from "./routes/cats.js";

export const app = express();

app.disable("x-powered-by");
// Só o site (WEB_ORIGIN) pode chamar a API pelo navegador.
app.use(cors({ origin: env.webOrigins }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({ name: "API Gatos de Francisca", docs: "GET /cats, GET /cats/:slug, GET /health" });
});

// Verifica se a API e o banco estão no ar (útil para a hospedagem monitorar).
app.get("/health", async (_req, res) => {
  await db.execute(sql`select 1`);
  res.json({ status: "ok" });
});

app.use("/cats", catsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Erros inesperados: registra no log e devolve uma mensagem genérica (sem vazar detalhes).
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
};
app.use(errorHandler);
