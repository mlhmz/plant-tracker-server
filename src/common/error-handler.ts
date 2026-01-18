import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";
import {
	type ErrorBody,
	ErrorCodes
} from "./error";

export const handleGenericError = (c: Context, error: unknown) => {
	if (error instanceof ZodError) {
		handleError(c, {
				errorCode: ErrorCodes.INPUT_VALIDATION_FAILED,
				validationErrors: error.issues,
			}, 400, error)
	} else {
		return handleError(c, {
			errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
		}, 500);
	}
};

export const handleError = (
	c: Context,
	errorBody: ErrorBody,
	statusCode: ContentfulStatusCode,
	error?: unknown,
) => {
	console.error(
		JSON.stringify({
			event: "error",
			message: JSON.stringify(error),
			statusCode,
			error: error,
			timestamp: new Date().toISOString(),
		}),
	);

	return c.json(errorBody, statusCode);
};
