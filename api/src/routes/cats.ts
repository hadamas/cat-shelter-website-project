import { Router } from "express";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { catPhotos, cats } from "../db/schema.js";
import { serializeCat } from "../lib/serialize.js";

export const catsRouter = Router();


// GET /cats?status=disponivel  → lista de gatos (padrão: disponíveis)
const listQuery = z.object({
  status: z.enum(["disponivel", "adotado"]).default("disponivel"),
});

catsRouter.get("/", async (req, res) => {
  const query = listQuery.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Parâmetros inválidos", details: z.flattenError(query.error).fieldErrors });
    return;
  }

  const rows = await db.query.cats.findMany({
    where: eq(cats.status, query.data.status),
    with: { photos: { orderBy: [asc(catPhotos.position)] } },
    orderBy: [asc(cats.arrivalDate)],
  });

  res.json(rows.map(serializeCat));
});

// GET /cats/:slug  → um gato
const slugSchema = z.string().regex(/^[a-z0-9-]{1,80}$/);

catsRouter.get("/:slug", async (req, res) => {
  const slug = slugSchema.safeParse(req.params.slug);
  if (!slug.success) {
    res.status(404).json({ error: "Gato não encontrado" });
    return;
  }

  const row = await db.query.cats.findFirst({
    where: eq(cats.slug, slug.data),
    with: { photos: { orderBy: [asc(catPhotos.position)] } },
  });

  if (!row) {
    res.status(404).json({ error: "Gato não encontrado" });
    return;
  }

  res.json(serializeCat(row));
});
