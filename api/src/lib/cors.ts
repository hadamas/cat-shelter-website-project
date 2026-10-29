import cors from "cors";
import { env } from "../env.js";

// Converte "https://meu-site-*.vercel.app" em uma expressão regular.
function toMatcher(pattern: string) {
  if (!pattern.includes("*")) return (origin: string) => origin === pattern;
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[a-z0-9-]+");
  const regex = new RegExp(`^${escaped}$`, "i");
  return (origin: string) => regex.test(origin);
}

const matchers = env.webOrigins.map(toMatcher);

// Só o site (WEB_ORIGIN) pode chamar a API pelo navegador.
// O * permite liberar os endereços de preview da Vercel, que mudam a cada deploy.
export const corsMiddleware = cors({
  origin(origin, callback) {
    // sem "origin": chamadas feitas por servidores (ex.: o build do site), não pelo navegador
    if (!origin) return callback(null, true);
    callback(null, matchers.some((match) => match(origin)));
  },
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});
