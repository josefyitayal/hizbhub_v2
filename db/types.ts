import type { DB } from "@/db/drizzle";

export type Tx = Parameters<DB["transaction"]>[0] extends (
    tx: infer T
) => any
    ? T
    : never;

export type DbClient = DB | Tx;
