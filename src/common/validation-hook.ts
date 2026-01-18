import type { Hook } from "@hono/zod-openapi";
import { ErrorCodes } from "./error";
import type { Variables } from "./workers";

export const validationHook: Hook<
	unknown,
	{ Bindings: Env; Variables: Variables },
	string,
	unknown
> = (result, c) => {
	if (!result.success) {
		console.error(
			JSON.stringify({
				event: "validation_error",
				message: ErrorCodes.INPUT_VALIDATION_FAILED.message,
				code: ErrorCodes.INPUT_VALIDATION_FAILED.code,
				statusCode: 400,
				validationErrors: result.error.issues,
				path: c.req.path,
				method: c.req.method,
				timestamp: new Date().toISOString(),
			}),
		);
		return c.json(
			{
				errorCode: ErrorCodes.INPUT_VALIDATION_FAILED,
				validationErrors: result.error.issues,
			},
			400,
		);
	}
};
