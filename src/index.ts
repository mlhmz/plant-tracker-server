import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Variables } from "./common/workers";
import { db } from "./db/drizzle";
import v1Router from "./routes/v1/v1.routes";

const app = new OpenAPIHono<{
	Bindings: Env;
	Variables: Variables;
}>();

app.use(async (c, next) => {
	c.set("db", db(c.env.PLANT_TRACKER_DB));
	await next();
});

app.route("/api/v1", v1Router);

// OpenAPI documentation
app.doc("/api/doc", {
	openapi: "3.0.0",
	info: {
		title: "Plant Tracker API",
		version: "1.0.0",
	},
});

// Swagger UI
app.get("/api/ui", swaggerUI({ url: "/api/doc" }));

export default app;
