import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "@/db/schemas";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool, {
    schema,
});

export type DB = typeof db;

export default db;
