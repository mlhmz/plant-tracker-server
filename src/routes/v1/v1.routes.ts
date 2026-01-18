import { OpenAPIHono } from "@hono/zod-openapi";
import type { Variables } from "../../common/workers";
import plantsRouter from "./plants.v1.routes";

const v1Router = new OpenAPIHono<{ Bindings: Env; Variables: Variables }>();

v1Router.route("/plants", plantsRouter);

export default v1Router;
