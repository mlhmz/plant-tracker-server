export type ErrorCode = {
  code: string;
  message: string;
};

export const ErrorCodes = {
  PLANT_NOT_FOUND: {
    code: 'error.plant.not_found',
    message: 'The requested plant was not found.',
  },
  PLANT_COULDNT_BE_CREATED: {
    code: 'error.plant.couldnt_be_created',
    message: 'The plant could not be created.',
  },
  INTERNAL_SERVER_ERROR: {
    code: 'error.internal_server_error',
    message: 'An internal server error occurred.',
  },
} as const;

export type ErrorCodeKey = keyof typeof ErrorCodes;

export function getErrorCode(key: ErrorCodeKey): ErrorCode {
  return ErrorCodes[key];
}