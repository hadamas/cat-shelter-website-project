import { Router } from "express";
import { and, asc, desc, eq, like, ne, or, type SQL } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { productPhotos, products } from "../db/schema.js";
import { requireRole } from "../lib/auth.js";
import { pickFreeSlug, slugify } from "../lib/slug.js";

export const productsRouter = Router();

type ProductRow = typeof products.$inferSelect & { photos: (typeof productPhotos.$inferSelect)[] };

// Formato usado pelo site (mesmo tipo `Product` do front-end). Valores em centavos.
function serializeProduct(p: ProductRow) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.priceCents,
    salePrice: p.salePriceCents,
    limitedEdition: p.limitedEdition,
    colors: p.colors,
    sizes: p.sizes,
    stock: p.stock,
    photos: p.photos.map((ph) => ({ src: ph.url, alt: ph.alt })),
  };
}

const withPhotos = { photos: { orderBy: [asc(productPhotos.position)] } };

function findProduct(where: SQL) {
  return db.query.products.findFirst({ where, with: withPhotos });
}

// ---------------------------------------------------------------------------
// Leitura (pública)
// ---------------------------------------------------------------------------

// GET /products → todos os produtos (mais recentes primeiro)
productsRouter.get("/", async (_req, res) => {
  const rows = await db.query.products.findMany({ with: withPhotos, orderBy: [desc(products.createdAt)] });
  res.json(rows.map(serializeProduct));
});

// GET /products/:slug → um produto
productsRouter.get("/:slug", async (req, res) => {
  const slug = z.string().regex(/^[a-z0-9-]{1,80}$/).safeParse(req.params.slug);
  const row = slug.success ? await findProduct(eq(products.slug, slug.data)) : undefined;
  if (!row) {
    res.status(404).json({ error: "Produto não encontrado" });
    return;
  }
  res.json(serializeProduct(row));
});

// ---------------------------------------------------------------------------
// Cadastro, edição e exclusão (só admins)
// ---------------------------------------------------------------------------

const DESCRIPTION_MAX_LENGTH = 1000; // mesmo limite do site (web/app/content/lojinha.ts)
const MAX_PHOTOS = 8;
const MIN_PRICE = 100; // R$ 1,00: valor mínimo aceito pela InfinitePay

const tag = z.string().trim().min(1).max(30, "Cada opção pode ter até 30 caracteres");
const options = z
  .array(tag)
  .max(20)
  .default([])
  .transform((list) => [...new Map(list.map((t) => [t.toLowerCase(), t])).values()]);
const cents = z.number().int("Valor inválido");

const productInput = z
  .object({
    name: z.string().trim().min(1, "Informe o nome").max(80),
    description: z
      .string()
      .trim()
      .min(1, "Escreva a descrição")
      .max(DESCRIPTION_MAX_LENGTH, `A descrição pode ter até ${DESCRIPTION_MAX_LENGTH} caracteres`),
    price: cents.min(MIN_PRICE, "O valor mínimo é R$ 1,00").max(10_000_000),
    salePrice: cents.min(MIN_PRICE, "O valor mínimo é R$ 1,00").nullable().default(null),
    limitedEdition: z.boolean().default(false),
    colors: options,
    sizes: options,
    stock: z.number().int("Informe um número inteiro").min(0, "O estoque não pode ser negativo").max(100_000),
    photos: z
      .array(
        z.object({
          url: z
            .string()
            .max(500)
            .refine((u) => u.startsWith("https://") || /^\/images\/[\w./-]+$/.test(u), "Endereço de foto inválido"),
          alt: z.string().trim().max(200).default(""),
        }),
      )
      .min(1, "Envie pelo menos uma foto")
      .max(MAX_PHOTOS, `Envie no máximo ${MAX_PHOTOS} fotos`),
  })
  .refine((p) => p.salePrice === null || p.salePrice < p.price, {
    path: ["salePrice"],
    message: "O valor promocional precisa ser menor que o valor do produto",
  });

type ProductInput = z.infer<typeof productInput>;
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

function columns(p: ProductInput) {
  return {
    name: p.name,
    description: p.description,
    priceCents: p.price,
    salePriceCents: p.salePrice,
    limitedEdition: p.limitedEdition,
    colors: p.colors,
    sizes: p.sizes,
    stock: p.stock,
  };
}

function photoRows(productId: string, p: ProductInput) {
  return p.photos.map((ph, position) => ({ productId, url: ph.url, alt: ph.alt || `Foto de ${p.name}`, position }));
}

async function uniqueSlug(tx: Tx, name: string, ignoreId?: string) {
  const base = slugify(name);
  const taken = await tx
    .select({ slug: products.slug })
    .from(products)
    .where(
      and(
        or(eq(products.slug, base), like(products.slug, `${base}-%`)),
        ignoreId ? ne(products.id, ignoreId) : undefined,
      ),
    );
  return pickFreeSlug(
    base,
    taken.map((t) => t.slug),
  );
}

function badRequest(res: import("express").Response, error: z.ZodError) {
  res.status(400).json({ error: "Confira os campos destacados", details: z.flattenError(error).fieldErrors });
}

const idSchema = z.uuid();

// POST /products → cadastra um produto
productsRouter.post("/", ...requireRole("admin"), async (req, res) => {
  const input = productInput.safeParse(req.body);
  if (!input.success) return badRequest(res, input.error);

  const data = input.data;
  const id = await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(products)
      .values({ ...columns(data), slug: await uniqueSlug(tx, data.name) })
      .returning({ id: products.id });
    await tx.insert(productPhotos).values(photoRows(row!.id, data));
    return row!.id;
  });

  res.status(201).json(serializeProduct((await findProduct(eq(products.id, id)))!));
});

// PUT /products/:id → edita um produto
productsRouter.put("/:id", ...requireRole("admin"), async (req, res) => {
  const id = idSchema.safeParse(req.params.id);
  if (!id.success) {
    res.status(404).json({ error: "Produto não encontrado" });
    return;
  }
  const input = productInput.safeParse(req.body);
  if (!input.success) return badRequest(res, input.error);

  const current = await db.query.products.findFirst({ where: eq(products.id, id.data) });
  if (!current) {
    res.status(404).json({ error: "Produto não encontrado" });
    return;
  }

  const data = input.data;
  await db.transaction(async (tx) => {
    await tx
      .update(products)
      .set({
        ...columns(data),
        slug: data.name === current.name ? current.slug : await uniqueSlug(tx, data.name, current.id),
      })
      .where(eq(products.id, current.id));
    await tx.delete(productPhotos).where(eq(productPhotos.productId, current.id));
    await tx.insert(productPhotos).values(photoRows(current.id, data));
  });

  res.json(serializeProduct((await findProduct(eq(products.id, current.id)))!));
});

// DELETE /products/:id → exclui um produto (as fotos do banco saem junto)
productsRouter.delete("/:id", ...requireRole("admin"), async (req, res) => {
  const id = idSchema.safeParse(req.params.id);
  const deleted = id.success
    ? await db.delete(products).where(eq(products.id, id.data)).returning({ id: products.id })
    : [];
  if (deleted.length === 0) {
    res.status(404).json({ error: "Produto não encontrado" });
    return;
  }
  res.status(204).end();
});
