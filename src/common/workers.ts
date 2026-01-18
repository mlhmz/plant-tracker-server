import { DrizzleD1Database } from "drizzle-orm/d1";

export interface Env {
    PLANT_TRACKER_DB: D1Database;
}

export type Variables = {
    db: DrizzleD1Database<Record<string, unknown>>;
}