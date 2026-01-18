import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import type z from "zod";
import { timestamps, uuid } from "./columns.helpers";

const plants = sqliteTable("plants", {
	id: uuid("id").primaryKey(),
	name: text("name").notNull(),
	species: text("species"),
	lastWatered: text("last_watered"),
	wateringInterval: integer("watering_interval").notNull(),
	lastFertilized: text("last_fertilized"),
	fertilizingInterval: integer("fertilizing_interval").notNull(),
	notes: text("notes"),
	...timestamps,
});

type QueryPlant = typeof plants.$inferSelect;

const insertPlantSchema = createInsertSchema(plants).pick({
	name: true,
	species: true,
	lastWatered: true,
	wateringInterval: true,
	lastFertilized: true,
	fertilizingInterval: true,
	notes: true,
});

const updatePlantSchema = createUpdateSchema(plants).pick({
	name: true,
	species: true,
	lastWatered: true,
	wateringInterval: true,
	lastFertilized: true,
	fertilizingInterval: true,
	notes: true,
});

type InsertPlant = z.infer<typeof insertPlantSchema>;
type UpdatePlant = z.infer<typeof updatePlantSchema>;

export {
	plants,
	type QueryPlant,
	type InsertPlant,
	type UpdatePlant,
	insertPlantSchema,
	updatePlantSchema,
};
