import { relations, sql } from "drizzle-orm";
import { boolean, date, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Segurança: todas as tabelas têm RLS (Row Level Security) ligado e SEM políticas.
// No Supabase, isso bloqueia o acesso direto pela API automática deles (chave "anon"):
// os dados só são lidos/alterados pela NOSSA API, que se conecta como dona do banco.

// ---------- Tipos (enums) ----------
export const sexEnum = pgEnum("sex", ["F", "M"]);
export const catStatusEnum = pgEnum("cat_status", ["disponivel", "adotado"]);
export const roleEnum = pgEnum("role", ["admin", "volunteer"]);

// ---------- Gatinhos ----------
export const cats = pgTable(
  "cats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** usado no endereço da página do gato: /como-ajudar/adote/{slug} */
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    sex: sexEnum("sex").notNull(),
    /** data de nascimento aproximada (calcula a idade) */
    birthDate: date("birth_date", { mode: "string" }).notNull(),
    /** data de entrada no gatil (calcula o tempo esperando adoção) */
    arrivalDate: date("arrival_date", { mode: "string" }).notNull(),
    coatColor: text("coat_color").notNull().default(""),
    /** cuidados veterinários em texto livre, um por item. Ex.: ["Castrado", "FIV negativo"] */
    vetCare: text("vet_care").array().notNull().default(sql`'{}'::text[]`),
    story: text("story").notNull().default(""),
    traits: text("traits").array().notNull().default(sql`'{}'::text[]`),
    /** "adotado" tira o gato da listagem de adoção, mas ele continua salvo no banco */
    status: catStatusEnum("status").notNull().default("disponivel"),
    adoptedAt: date("adopted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("cats_status_idx").on(t.status)],
).enableRLS();

// ---------- Fotos dos gatinhos (uma ou mais por gato) ----------
export const catPhotos = pgTable(
  "cat_photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    catId: uuid("cat_id")
      .notNull()
      .references(() => cats.id, { onDelete: "cascade" }), // apagar o gato apaga as fotos
    url: text("url").notNull(),
    alt: text("alt").notNull().default(""),
    /** ordem de exibição: 0 é a foto principal */
    position: integer("position").notNull().default(0),
  },
  (t) => [index("cat_photos_cat_idx").on(t.catId, t.position)],
).enableRLS();

// ---------- Usuários com acesso ao site (voluntários e admins) ----------
// O login (e-mail e senha) fica no Supabase Auth. Esta tabela guarda só quem tem
// acesso e com qual papel. O `id` é o MESMO id do usuário no Supabase Auth.
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: roleEnum("role").notNull().default("volunteer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

// ---------- Lojinha: produtos ----------
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** usado no endereço da página do produto: /lojinha/{slug} */
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  /** preço em centavos (R$ 25,90 = 2590): evita erros de arredondamento */
  priceCents: integer("price_cents").notNull(),
  /** preço promocional em centavos; null = sem promoção */
  salePriceCents: integer("sale_price_cents"),
  limitedEdition: boolean("limited_edition").notNull().default(false),
  /** opções que o comprador escolhe; lista vazia = "Única" */
  colors: text("colors").array().notNull().default(sql`'{}'::text[]`),
  sizes: text("sizes").array().notNull().default(sql`'{}'::text[]`),
  /** quantidade disponível; 0 = esgotado */
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}).enableRLS();

export const productPhotos = pgTable(
  "product_photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt").notNull().default(""),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("product_photos_product_idx").on(t.productId, t.position)],
).enableRLS();

// ---------- Relações (para buscar o gato já com as fotos) ----------
export const catsRelations = relations(cats, ({ many }) => ({ photos: many(catPhotos) }));
export const catPhotosRelations = relations(catPhotos, ({ one }) => ({
  cat: one(cats, { fields: [catPhotos.catId], references: [cats.id] }),
}));

export const productsRelations = relations(products, ({ many }) => ({ photos: many(productPhotos) }));
export const productPhotosRelations = relations(productPhotos, ({ one }) => ({
  product: one(products, { fields: [productPhotos.productId], references: [products.id] }),
}));
