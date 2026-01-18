import { Hono } from "hono";
import type { Variables } from "./common/workers";
import { db } from "./db/drizzle";
import plantsRouter from "./routes/v1/plants.v1.routes";
import v1Router from "./routes/v1/v1.routes";

const app = new Hono<{
	Bindings: Env;
	Variables: Variables;
}>();

app.use(async (c, next) => {
	c.set("db", db(c.env.PLANT_TRACKER_DB));
	await next();
});


app.route("/api/v1", v1Router);

export default app;
