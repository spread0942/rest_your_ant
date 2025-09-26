export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

export const createSuccessResponse = <T>(data: T, message: string = 'Success'): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const createErrorResponse = (message: string, error?: string): ApiResponse => ({
  success: false,
  message,
  error,
});

export const createValidationErrorResponse = (errors: any): ApiResponse => ({
  success: false,
  message: 'Validation failed',
  error: errors,
});
