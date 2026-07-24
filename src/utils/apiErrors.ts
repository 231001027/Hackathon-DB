/**
 * API Error Handling Utilities
 * Comprehensive error handling for API calls and network operations
 */

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(
    public code: string,
    public statusCode?: number,
    public details?: Record<string, unknown>
  ) {
    super(code);
    this.name = 'APIError';
  }
}

/**
 * Error codes and user-friendly messages
 */
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: 'Network connection failed. Please check your internet connection.',
    retry: true,
  },
  REQUEST_TIMEOUT: {
    code: 'REQUEST_TIMEOUT',
    message: 'Request took too long. Please try again.',
    retry: true,
  },

  // Authentication errors
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Your session has expired. Please log in again.',
    retry: false,
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Email or password is incorrect.',
    retry: true,
  },
  ACCOUNT_LOCKED: {
    code: 'ACCOUNT_LOCKED',
    message: 'Your account is locked. Contact support.',
    retry: false,
  },

  // Validation errors
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Please check the highlighted fields and try again.',
    retry: true,
  },
  DUPLICATE_EMAIL: {
    code: 'DUPLICATE_EMAIL',
    message: 'This email is already registered.',
    retry: true,
  },

  // Permission errors
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'You do not have permission to perform this action.',
    retry: false,
  },

  // Server errors
  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    message: 'Something went wrong on the server. Please try again later.',
    retry: true,
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    message: 'The service is temporarily unavailable. Please try again later.',
    retry: true,
  },

  // General errors
  UNKNOWN_ERROR: {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred. Please try again.',
    retry: true,
  },
} as const;

/**
 * Get user-friendly error message
 */
export function getErrorMessage(
  error: unknown
): { message: string; code: string; retry: boolean } {
  // Handle APIError
  if (error instanceof APIError) {
    const errorConfig = Object.values(ERROR_CODES).find(
      (e) => e.code === error.code
    );
    if (errorConfig) {
      return {
        message: errorConfig.message,
        code: errorConfig.code,
        retry: errorConfig.retry,
      };
    }
  }

  // Handle standard Error
  if (error instanceof Error) {
    const message = error.message || ERROR_CODES.UNKNOWN_ERROR.message;
    return {
      message,
      code: 'ERROR',
      retry: true,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'ERROR',
      retry: true,
    };
  }

  // Fallback
  return {
    message: ERROR_CODES.UNKNOWN_ERROR.message,
    code: ERROR_CODES.UNKNOWN_ERROR.code,
    retry: ERROR_CODES.UNKNOWN_ERROR.retry,
  };
}

/**
 * Handle fetch response errors
 */
export async function handleFetchError(response: Response): Promise<never> {
  const statusCode = response.status;
  let errorCode = 'SERVER_ERROR';
  let details: Record<string, unknown> = {};

  // Try to parse error response body
  try {
    const body = await response.json();
    errorCode = body.code || body.error || errorCode;
    details = body.details || {};
  } catch {
    // Response is not JSON, use status code to determine error
    if (statusCode === 400) {
      errorCode = 'VALIDATION_ERROR';
    } else if (statusCode === 401) {
      errorCode = 'UNAUTHORIZED';
    } else if (statusCode === 403) {
      errorCode = 'FORBIDDEN';
    } else if (statusCode === 404) {
      errorCode = 'NOT_FOUND';
    } else if (statusCode === 409) {
      errorCode = 'DUPLICATE_EMAIL';
    } else if (statusCode >= 500) {
      errorCode = 'SERVER_ERROR';
    }
  }

  throw new APIError(errorCode, statusCode, details);
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options?: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
  }
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
  } = options || {};

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if error is retryable
      if (error instanceof APIError) {
        const errorConfig = Object.values(ERROR_CODES).find(
          (e) => e.code === error.code
        );
        if (!errorConfig?.retry) {
          throw error;
        }
      }

      // Calculate delay with exponential backoff
      if (attempt < maxAttempts - 1) {
        const delay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt),
          maxDelay
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retry attempts reached');
}

/**
 * Validate API response structure
 */
export function validateResponse<T>(
  data: unknown,
  schema?: (data: unknown) => data is T
): T {
  if (!data) {
    throw new APIError('VALIDATION_ERROR', undefined, {
      message: 'Empty response from server',
    });
  }

  if (schema && !schema(data)) {
    throw new APIError('VALIDATION_ERROR', undefined, {
      message: 'Invalid response structure from server',
    });
  }

  return data as T;
}
