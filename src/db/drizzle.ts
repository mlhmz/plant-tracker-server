import { drizzle } from "drizzle-orm/d1";

export interface Env {
    PLANT_TRACKER_DB: D1Database;
}

export const db = (env: Env) => drizzle(env.PLANT_TRACKER_DB);