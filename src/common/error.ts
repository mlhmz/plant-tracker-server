import type { Context } from "hono";
import z from "zod";
import type { $ZodIssue } from "zod/v4/core";

const errorCodeSchema = z.object({
	code: z.string(),
	message: z.string(),
});

export const errorResponseSchema = z.object({
	errorCode: z.object({
		code: z.string(),
		message: z.string(),
	}),
	validationErrors: z.array(z.any()).optional(),
});

export type ErrorCode = z.infer<typeof errorCodeSchema>;

export type ErrorResponse = z.infer<typeof errorResponseSchema> & {
	validationErrors?: $ZodIssue[];
};

export const ErrorCodes = {
	PLANT_NOT_FOUND: {
		code: "error.plant.not_found",
		message: "The requested plant was not found.",
	},
	PLANT_COULDNT_BE_CREATED: {
		code: "error.plant.couldnt_be_created",
		message: "The plant could not be created.",
	},
	INPUT_VALIDATION_FAILED: {
		code: "error.input.validation_failed",
		message: "Input validation failed.",
	},
	INTERNAL_SERVER_ERROR: {
		code: "error.internal_server_error",
		message: "An internal server error occurred.",
	},
} as const;

export type ErrorCodeKey = keyof typeof ErrorCodes;

export function getErrorCode(key: ErrorCodeKey): ErrorCode {
	return ErrorCodes[key];
}

export const logError = (
	c: Context,
	errorCode: ErrorCode,
	statusCode: number,
	error?: unknown,
) => {
	const errorLog: Record<string, unknown> = {
		event: "error",
		message: errorCode.message,
		code: errorCode.code,
		statusCode,
		path: c.req.path,
		method: c.req.method,
		timestamp: new Date().toISOString(),
	};

	if (error) {
		errorLog.error = error instanceof Error ? error.message : String(error);
	}

	console.error(JSON.stringify(errorLog));
};
