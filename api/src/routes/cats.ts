import { Router } from "express";
import { and, asc, eq, like, ne, or, type SQL } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { catPhotos, cats } from "../db/schema.js";
import { requireRole } from "../lib/auth.js";
import { serializeCat } from "../lib/serialize.js";

export const catsRouter = Router();

// ---------------------------------------------------------------------------
// Leitura (pública)
// ---------------------------------------------------------------------------

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

  const row = await findCat(eq(cats.slug, slug.data));
  if (!row) {
    res.status(404).json({ error: "Gato não encontrado" });
    return;
  }

  res.json(serializeCat(row));
});

// ---------------------------------------------------------------------------
// Cadastro e edição (só admins)
// Não existe rota para excluir: um gato adotado sai da listagem (status
// "adotado"), mas continua no banco para o futuro mural de adotados.
// ---------------------------------------------------------------------------

const STORY_MAX_LENGTH = 1000; // mesmo limite do site (web/app/content/adocao.ts)
const MAX_PHOTOS = 8;

const today = () => new Date().toISOString().slice(0, 10);
const isoDate = z.iso.date({ error: "Data inválida" }).refine((d) => d <= today(), "A data não pode estar no futuro");
const tag = z.string().trim().min(1).max(40, "Cada item pode ter até 40 caracteres");
const tags = (field: string) =>
  z
    .array(tag)
    .min(1, `Informe pelo menos um item em ${field}`)
    .max(20)
    .transform((list) => [...new Map(list.map((t) => [t.toLowerCase(), t])).values()]); // sem repetidos

// Fotos: as enviadas pelo site ficam no Supabase Storage (https://...).
// Caminhos que começam com "/images/" são da pasta public/ do site (gatos de exemplo).
const photoUrl = z
  .string()
  .max(500)
  .refine((u) => u.startsWith("https://") || /^\/images\/[\w./-]+$/.test(u), "Endereço de foto inválido");

const catInput = z
  .object({
    name: z.string().trim().min(1, "Informe o nome").max(60),
    sex: z.enum(["F", "M"], { error: "Escolha o sexo" }),
    birthDate: isoDate,
    arrivalDate: isoDate,
    coatColor: z.string().trim().min(1, "Escolha a cor da pelagem").max(60),
    vetCare: tags("Cuidados veterinários"),
    story: z
      .string()
      .trim()
      .min(1, "Conte a história")
      .max(STORY_MAX_LENGTH, `A história pode ter até ${STORY_MAX_LENGTH} caracteres`),
    traits: tags("Características"),
    status: z.enum(["disponivel", "adotado"]).default("disponivel"),
    photos: z
      .array(z.object({ url: photoUrl, alt: z.string().trim().max(200).default("") }))
      .min(1, "Envie pelo menos uma foto")
      .max(MAX_PHOTOS, `Envie no máximo ${MAX_PHOTOS} fotos`),
  })
  .refine((c) => c.birthDate <= c.arrivalDate, {
    path: ["arrivalDate"],
    message: "A entrada no gatil não pode ser antes do nascimento",
  });

type CatInput = z.infer<typeof catInput>;

const idSchema = z.uuid();

// POST /cats → cadastra um gato
catsRouter.post("/", ...requireRole("admin"), async (req, res) => {
  const input = catInput.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: "Confira os campos destacados", details: z.flattenError(input.error).fieldErrors });
    return;
  }

  const data = input.data;
  const id = await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(cats)
      .values({
        ...catColumns(data),
        slug: await uniqueSlug(tx, data.name),
        adoptedAt: data.status === "adotado" ? today() : null,
      })
      .returning({ id: cats.id });
    await tx.insert(catPhotos).values(photoRows(row!.id, data));
    return row!.id;
  });

  res.status(201).json(serializeCat((await findCat(eq(cats.id, id)))!));
});

// PUT /cats/:id → edita um gato (inclusive marcar como adotado)
catsRouter.put("/:id", ...requireRole("admin"), async (req, res) => {
  const id = idSchema.safeParse(req.params.id);
  if (!id.success) {
    res.status(404).json({ error: "Gato não encontrado" });
    return;
  }
  const input = catInput.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: "Confira os campos destacados", details: z.flattenError(input.error).fieldErrors });
    return;
  }

  const current = await db.query.cats.findFirst({ where: eq(cats.id, id.data) });
  if (!current) {
    res.status(404).json({ error: "Gato não encontrado" });
    return;
  }

  const data = input.data;
  await db.transaction(async (tx) => {
    await tx
      .update(cats)
      .set({
        ...catColumns(data),
        // o endereço da página acompanha o nome, se ele mudar
        slug: data.name === current.name ? current.slug : await uniqueSlug(tx, data.name, current.id),
        // guarda quando foi adotado (útil para o mural de adotados)
        adoptedAt: data.status === "adotado" ? (current.adoptedAt ?? today()) : null,
      })
      .where(eq(cats.id, current.id));
    // fotos: substitui a lista inteira (mantém a ordem escolhida no site)
    await tx.delete(catPhotos).where(eq(catPhotos.catId, current.id));
    await tx.insert(catPhotos).values(photoRows(current.id, data));
  });

  res.json(serializeCat((await findCat(eq(cats.id, current.id)))!));
});

// ---------------------------------------------------------------------------
// Auxiliares
// ---------------------------------------------------------------------------

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

function findCat(where: SQL) {
  return db.query.cats.findFirst({ where, with: { photos: { orderBy: [asc(catPhotos.position)] } } });
}

function catColumns(c: CatInput) {
  return {
    name: c.name,
    sex: c.sex,
    birthDate: c.birthDate,
    arrivalDate: c.arrivalDate,
    coatColor: c.coatColor,
    vetCare: c.vetCare,
    story: c.story,
    traits: c.traits,
    status: c.status,
  };
}

function photoRows(catId: string, c: CatInput) {
  return c.photos.map((p, position) => ({
    catId,
    url: p.url,
    alt: p.alt || `Foto de ${c.name}`,
    position,
  }));
}

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70) || "gatinho";

/** "Mel" → "mel"; se já existir outro gato com esse endereço → "mel-2", "mel-3"... */
async function uniqueSlug(tx: Tx, name: string, ignoreId?: string) {
  const base = slugify(name);
  const taken = await tx
    .select({ slug: cats.slug })
    .from(cats)
    .where(and(or(eq(cats.slug, base), like(cats.slug, `${base}-%`)), ignoreId ? ne(cats.id, ignoreId) : undefined));
  const used = new Set(taken.map((t) => t.slug));
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
