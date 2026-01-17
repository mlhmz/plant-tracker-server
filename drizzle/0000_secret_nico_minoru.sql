CREATE TABLE `plants` (
	`id` text PRIMARY KEY DEFAULT 'ce3ada5d-f32d-4476-a936-41fa63d325cf' NOT NULL,
	`name` text NOT NULL,
	`species` text NOT NULL,
	`last_watered` text NOT NULL,
	`watering_interval` integer NOT NULL,
	`last_fertilized` text NOT NULL,
	`fertilizing_interval` integer NOT NULL,
	`notes` text,
	`updated_at` text DEFAULT '2026-01-17T12:45:47.981947969Z' NOT NULL,
	`created_at` text DEFAULT '2026-01-17T12:45:47.983947981Z' NOT NULL,
	`deleted_at` text
);
