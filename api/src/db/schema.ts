import { relations, sql } from "drizzle-orm";
import { boolean, date, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Segurança: todas as tabelas têm RLS (Row Level Security) ligado e SEM políticas.
// No Supabase, isso bloqueia o acesso direto pela API automática deles (chave "anon"):
// os dados só são lidos/alterados pela NOSSA API, que se conecta como dona do banco.

// ---------- Tipos (enums) ----------
export const sexEnum = pgEnum("sex", ["F", "M"]);
export const testResultEnum = pgEnum("test_result", ["negativo", "positivo", "nao_testado"]);
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
    neutered: boolean("neutered").notNull().default(false),
    vaccinated: boolean("vaccinated").notNull().default(false),
    dewormed: boolean("dewormed").notNull().default(false),
    fiv: testResultEnum("fiv").notNull().default("nao_testado"),
    felv: testResultEnum("felv").notNull().default("nao_testado"),
    story: text("story").notNull().default(""),
    traits: text("traits").array().notNull().default(sql`'{}'::text[]`),
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

// ---------- Usuários (voluntários e admins) — login na próxima etapa ----------
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  /** nunca a senha em texto: só o hash */
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("volunteer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

// ---------- Relações (para buscar o gato já com as fotos) ----------
export const catsRelations = relations(cats, ({ many }) => ({ photos: many(catPhotos) }));
export const catPhotosRelations = relations(catPhotos, ({ one }) => ({
  cat: one(cats, { fields: [catPhotos.catId], references: [cats.id] }),
}));
