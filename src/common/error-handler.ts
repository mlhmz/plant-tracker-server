import { Context } from 'hono';
import { ErrorCode } from './error-codes';
import { ContentfulStatusCode } from 'hono/utils/http-status';

// Centralized error handler utility
export const handleError = (c: Context, errorCode: ErrorCode, statusCode: ContentfulStatusCode) => {
  return c.json(errorCode, statusCode);
};