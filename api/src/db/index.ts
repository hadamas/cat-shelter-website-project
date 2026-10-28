import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "../env.js";
import * as schema from "./schema.js";

const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(env.DATABASE_URL);

// Pool de conexões com o Postgres.
// Bancos na nuvem (Supabase, Neon) exigem SSL; o banco local não.
export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: env.DB_POOL_MAX,
});

export const db = drizzle(pool, { schema });
