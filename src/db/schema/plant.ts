import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps, uuid } from "./columns.helpers";

export const plants = sqliteTable("plants", {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    species: text("species").notNull(),
    lastWatered: text("last_watered").notNull(),
    wateringInterval: integer("watering_interval").notNull(), // in days
    lastFertilized: text("last_fertilized").notNull(),
    fertilizingInterval: integer("fertilizing_interval").notNull(), // in days
    notes: text("notes"),
    ...timestamps,
});

type QueryPlant = typeof plants.$inferSelect;
type MutatePlant = Omit<typeof plants.$inferInsert, "deleted_at" | "created_at" | "updated_at" | "id">;
export { QueryPlant, MutatePlant };