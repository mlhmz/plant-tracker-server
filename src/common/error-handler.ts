import { Context } from 'hono';
import { ErrorCode } from './error-codes';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export const handleError = (c: Context, errorCode: ErrorCode, statusCode: ContentfulStatusCode, error?: unknown) => {
  console.error(JSON.stringify({
    event: 'error',
    message: errorCode.message,
    errorCode,
    statusCode,
    error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    timestamp: new Date().toISOString(),
  }));

  return c.json(errorCode, statusCode);
};