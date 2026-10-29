import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { createRemoteJWKSet, decodeProtectedHeader, jwtVerify, type JWTPayload } from "jose";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { env } from "../env.js";

// ---------------------------------------------------------------------------
// Como funciona o login:
// 1. A pessoa entra no site com e-mail e senha (Supabase Auth).
// 2. O Supabase entrega um "token" (JWT) assinado, que o site envia em cada
//    pedido à API no cabeçalho:  Authorization: Bearer <token>
// 3. Aqui a API confere a assinatura do token com as chaves públicas do
//    Supabase e busca na tabela `users` qual é o papel da pessoa.
// ---------------------------------------------------------------------------

export type Role = "admin" | "volunteer";
export type AuthUser = { id: string; name: string; email: string; role: Role };

const issuer = `${env.SUPABASE_URL}/auth/v1`;
const jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));
const legacySecret = env.SUPABASE_JWT_SECRET ? new TextEncoder().encode(env.SUPABASE_JWT_SECRET) : null;

async function verifyToken(token: string): Promise<JWTPayload> {
  const options = { issuer, audience: "authenticated" };
  const { alg } = decodeProtectedHeader(token);
  // Projetos novos do Supabase usam chaves assimétricas (ES256/RS256, via JWKS).
  // Projetos antigos usam um segredo compartilhado (HS256).
  if (alg === "HS256") {
    if (!legacySecret) throw new Error("Token HS256 recebido, mas SUPABASE_JWT_SECRET não foi configurado");
    return (await jwtVerify(token, legacySecret, options)).payload;
  }
  return (await jwtVerify(token, jwks, options)).payload;
}

function getBearer(req: Request) {
  const header = req.headers.authorization ?? "";
  const [type, token] = header.split(" ");
  return type === "Bearer" && token ? token : null;
}

/** Exige login. Coloca o usuário em res.locals.user. */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getBearer(req);
  if (!token) {
    res.status(401).json({ error: "Faça login para continuar" });
    return;
  }

  let payload: JWTPayload;
  try {
    payload = await verifyToken(token);
  } catch {
    res.status(401).json({ error: "Sessão inválida ou expirada. Faça login novamente." });
    return;
  }

  const [user] = await db.select().from(users).where(eq(users.id, String(payload.sub))).limit(1);
  if (!user) {
    // conta existe no Supabase, mas não foi liberada no site (sem papel)
    res.status(403).json({ error: "Sua conta ainda não tem acesso. Fale com um administrador." });
    return;
  }

  res.locals.user = { id: user.id, name: user.name, email: user.email, role: user.role } satisfies AuthUser;
  next();
}

/** Exige login E um dos papéis informados. Ex.: requireRole("admin") */
export function requireRole(...roles: Role[]) {
  return [
    requireAuth,
    (_req: Request, res: Response, next: NextFunction) => {
      const user = res.locals.user as AuthUser;
      if (!roles.includes(user.role)) {
        res.status(403).json({ error: "Você não tem permissão para esta ação" });
        return;
      }
      next();
    },
  ];
}
