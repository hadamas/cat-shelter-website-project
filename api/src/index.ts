import { app } from "./app.js";
import { pool } from "./db/index.js";
import { env } from "./env.js";

const server = app.listen(env.PORT, () => {
  console.log(`🐾 API rodando em http://localhost:${env.PORT}`);
});

// Encerra com calma (termina as requisições e fecha o banco) ao parar o servidor.
function shutdown() {
  server.close(() => {
    pool.end().finally(() => process.exit(0));
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
