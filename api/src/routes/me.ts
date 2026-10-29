import { Router } from "express";
import { requireAuth, type AuthUser } from "../lib/auth.js";

export const meRouter = Router();

// GET /me → dados de quem está logado (usado pelo site para mostrar o nome e o papel)
meRouter.get("/", requireAuth, (_req, res) => {
  res.json(res.locals.user as AuthUser);
});
