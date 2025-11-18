/**
 * Custom Error Classes for Application
 */

export class AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class APIError extends AppError {
  constructor(
    message: string,
    statusCode: number,
    code?: string,
    details?: unknown
  ) {
    super(message, code, statusCode, details);
  }
}

export class AuthenticationError extends APIError {
  constructor(message = '인증이 필요합니다', details?: unknown) {
    super(message, 401, 'AUTHENTICATION_ERROR', details);
  }
}

export class AuthorizationError extends APIError {
  constructor(message = '권한이 없습니다', details?: unknown) {
    super(message, 403, 'AUTHORIZATION_ERROR', details);
  }
}

export class ValidationError extends APIError {
  constructor(message = '입력값이 올바르지 않습니다', details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends APIError {
  constructor(message = '요청한 리소스를 찾을 수 없습니다', details?: unknown) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class NetworkError extends AppError {
  constructor(message = '네트워크 연결에 실패했습니다', details?: unknown) {
    super(message, 'NETWORK_ERROR', 0, details);
  }
}

export class TimeoutError extends AppError {
  constructor(message = '요청 시간이 초과되었습니다', details?: unknown) {
    super(message, 'TIMEOUT_ERROR', 408, details);
  }
}

/**
 * Error Handler Utility
 */
export const handleError = (error: unknown): AppError => {
  // Already our custom error
  if (error instanceof AppError) {
    return error;
  }

  // Axios error
  if (isAxiosError(error)) {
    const status = error.response?.status || 0;
    const message = error.response?.data?.message || error.message;
    const code = error.response?.data?.code;
    const details = error.response?.data;

    // Map status codes to specific errors
    switch (status) {
      case 401:
        return new AuthenticationError(message, details);
      case 403:
        return new AuthorizationError(message, details);
      case 404:
        return new NotFoundError(message, details);
      case 400:
        return new ValidationError(message, details);
      case 0:
        return new NetworkError(message, details);
      default:
        return new APIError(message, status, code, details);
    }
  }

  // Generic JavaScript error
  if (error instanceof Error) {
    return new AppError(error.message);
  }

  // Unknown error
  return new AppError('알 수 없는 오류가 발생했습니다');
};

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: unknown): error is {
  response?: {
    status: number;
    data?: {
      message?: string;
      code?: string;
      [key: string]: unknown;
    };
  };
  message: string;
  code?: string;
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    'message' in error
  );
}

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (error: AppError): string => {
  const messageMap: Record<string, string> = {
    NETWORK_ERROR: '인터넷 연결을 확인해주세요',
    TIMEOUT_ERROR: '요청 시간이 초과되었습니다. 다시 시도해주세요',
    AUTHENTICATION_ERROR: '로그인이 필요합니다',
    AUTHORIZATION_ERROR: '접근 권한이 없습니다',
    VALIDATION_ERROR: '입력 정보를 다시 확인해주세요',
    NOT_FOUND: '요청하신 정보를 찾을 수 없습니다',
  };

  return messageMap[error.code || ''] || error.message || '오류가 발생했습니다';
};
