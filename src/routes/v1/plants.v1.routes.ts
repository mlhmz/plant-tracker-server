import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm/sql";
import { ErrorCodes, errorResponseSchema, logError } from "../../common/error";
import { validationHook } from "../../common/validation-hook";
import type { Variables } from "../../common/workers";
import {
	insertPlantSchema,
	plantResponseSchema,
	plants,
	plantsArrayResponseSchema,
	updatePlantSchema,
} from "../../db/schema/plant";

const plantsRouter = new OpenAPIHono<{ Bindings: Env; Variables: Variables }>({
	defaultHook: validationHook,
});

const getAllPlantsRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Plants"],
	responses: {
		200: {
			content: {
				"application/json": {
					schema: plantsArrayResponseSchema,
				},
			},
			description: "List of all plants",
		},
		400: {
			content: {
				"application/json": {
					schema: errorResponseSchema,
				},
			},
			description: "Validation error",
		},
		500: {
			content: {
				"application/json": {
					schema: errorResponseSchema,
				},
			},
			description: "Internal server error",
		},
	},
});

plantsRouter.openapi(getAllPlantsRoute, async (c) => {
	try {
		const result = await c.var.db.select().from(plants);
		return c.json(result, 200);
	} catch (error) {
		logError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500, error);
		return c.json({ errorCode: ErrorCodes.INTERNAL_SERVER_ERROR }, 500);
	}
});

const getPlantByIdRoute = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Plants"],
	request: {
		params: z.object({
			id: z.string().openapi({
				param: {
					name: "id",
					in: "path",
				},
				example: "550e8400-e29b-41d4-a716-446655440000",
			}),
		}),
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: plantResponseSchema,
				},
			},
			description: "Plant details",
		},
		400: {
			content: {
				"application/json": {
					schema: errorResponseSchema,
				},
			},
			description: "Validation error",
		},
		404: {
			content: {
				"application/json": {
					schema: errorResponseSchema,
				},
			},
			description: "Plant not found",
		},
		500: {
			content: {
				"application/json": {
					schema: errorResponseSchema,
				},
			},
			description: "Internal server error",
		},
	},
});

plantsRouter.openapi(getPlantByIdRoute, async (c) => {
	try {
		const { id } = c.req.valid("param");
		const result = await c.var.db
			.select()
			.from(plants)
			.where(eq(plants.id, id))
			.limit(1);
		if (result.length === 0) {
			return c.json({ errorCode: ErrorCodes.PLANT_NOT_FOUND }, 404);
		}
		return c.json(result[0], 200);
	} catch (error) {
		logError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500, error);
		return c.json({ errorCode: ErrorCodes.INTERNAL_SERVER_ERROR }, 500);
	}
});

const createPlantRoute = createRoute({
	method: "post",
	path: "/",
	tags: ["Plants"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: insertPlantSchema,
				},
			},
		},
	},
	responses: {
		201: {
			content: {
				"application/json": {
					schema: plantResponseSchema,
				},
			},
			description: "Plant created successfully",
		},
		400: {
			content: {
				"application/json": {
					schema: errorResponseSchema,
				},
			},
			description: "Bad request - validation error",
		},
		500: {
			content: {
				"application/json": {
					schema: errorResponseSchema,
				},
			},
			description: "Internal server error",
		},
	},
});

plantsRouter.openapi(
	createPlantRoute,
	async (c) => {
	try {
		const plant = c.req.valid("json");

		const results = await c.var.db.insert(plants).values(plant).returning();

		if (results.length === 0) {
		logError(c, ErrorCodes.PLANT_COULDNT_BE_CREATED, 500);
		return c.json({ errorCode: ErrorCodes.PLANT_COULDNT_BE_CREATED }, 500);
	}

		const result = results[0];

		console.log(
			JSON.stringify({
				event: "db_transaction",
				message: `Created a new plant with the id ${result.id}`,
				table: "plants",
				metadata: { result },
				timestamp: new Date().toISOString(),
			}),
		);

		return c.json(result, 201);
	} catch (error) {
		logError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500, error);
		return c.json({ errorCode: ErrorCodes.INTERNAL_SERVER_ERROR }, 500);
	}
});

const updatePlantRoute = createRoute({
	method: "put",
	path: "/{id}",
	tags: ["Plants"],
	request: {
		params: z.object({
			id: z.string().openapi({
				param: {
					name: "id",
					in: "path",
				},
				example: "550e8400-e29b-41d4-a716-446655440000",
			}),
		}),
		body: {
			content: {
				"application/json": {
					schema: updatePlantSchema,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: plantResponseSchema,
				},
			},
			description: "Plant updated successfully",
		},
		400: {
			content: {
				"application/json": {
					schema: errorResponseSchema,
				},
			},
			description: "Bad request - validation error",
		},
		404: {
			content: {
				"application/json": {
					schema: errorResponseSchema,
				},
			},
			description: "Plant not found",
		},
		500: {
			content: {
				"application/json": {
					schema: errorResponseSchema,
				},
			},
			description: "Internal server error",
		},
	},
});


plantsRouter.openapi(updatePlantRoute, async (c) => {
	try {
		const { id } = c.req.valid("param");
		const plant = c.req.valid("json");

		const result = await c.var.db
			.update(plants)
			.set(plant)
			.where(eq(plants.id, id))
			.returning();

		if (result.length === 0) {
		logError(c, ErrorCodes.PLANT_NOT_FOUND, 404);
		return c.json({ errorCode: ErrorCodes.PLANT_NOT_FOUND }, 404);
	}

		console.log(
			JSON.stringify({
				event: "db_transaction",
				message: `Updated the plant with the id ${result[0].id}`,
				table: "plants",
				metadata: { result },
				timestamp: new Date().toISOString(),
			}),
		);

		return c.json(result[0], 200);
} catch (error) {
	logError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500, error);
	return c.json({ errorCode: ErrorCodes.INTERNAL_SERVER_ERROR }, 500);
}
});

const deletePlantRoute = createRoute({
	method: "delete",
	path: "/{id}",
	tags: ["Plants"],
	request: {
		params: z.object({
			id: z.string().openapi({
				param: {
					name: "id",
					in: "path",
				},
				example: "550e8400-e29b-41d4-a716-446655440000",
			}),
		}),
	},
	responses: {
		204: {
			description: "Plant deleted successfully",
		},
		404: {
			content: {
				"application/json": {
					schema: errorResponseSchema,
				},
			},
			description: "Plant not found",
		},
		500: {
			content: {
				"application/json": {
					schema: errorResponseSchema,
				},
			},
			description: "Internal server error",
		},
	},
});

plantsRouter.openapi(deletePlantRoute, async (c) => {
	try {
		const { id } = c.req.valid("param");

		const result = await c.var.db
			.delete(plants)
			.where(eq(plants.id, id))
			.returning();

		console.log(
			JSON.stringify({
				event: "db_transaction_result",
				message: `Deleted plant with ID ${id}`,
				table: "plants",
				metadata: { result },
				timestamp: new Date().toISOString(),
			}),
		);

		if (result.length === 0) {
			logError(c, ErrorCodes.PLANT_NOT_FOUND, 404);
			return c.json({ errorCode: ErrorCodes.PLANT_NOT_FOUND }, 404);
		}
		return c.body(null, 204);
	} catch (error) {
		logError(c, ErrorCodes.INTERNAL_SERVER_ERROR, 500, error);
		return c.json({ errorCode: ErrorCodes.INTERNAL_SERVER_ERROR }, 500);
	}
});

export default plantsRouter;
