import { logger } from "./logger";

export interface AppError {
  message: string;
  code?: string;
  correlationId: string;
  details?: any;
}

/**
 * Enhanced error handler with correlation IDs
 */
export function handleError(
  error: unknown,
  context: {
    component: string;
    action: string;
    userId?: string;
  }
): AppError {
  const correlationId = logger.generateCorrelationId();
  logger.setCorrelationId(correlationId);

  const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
  
  logger.error(
    `Error in ${context.component}`,
    error instanceof Error ? error : undefined,
    {
      correlationId,
      action: context.action,
      userId: context.userId,
    }
  );

  return {
    message: errorMessage,
    correlationId,
    code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
    details: error instanceof Error ? error.stack : error,
  };
}

/**
 * Format error message for display to users
 */
export function formatErrorForUser(appError: AppError): string {
  return `${appError.message} (Ref: ${appError.correlationId.slice(-8)})`;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes("network") || 
           error.message.includes("fetch") ||
           error.message.includes("Failed to fetch");
  }
  return false;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error && 'code' in error) {
    const code = (error as any).code;
    return code === 'PGRST301' || // JWT expired
           code === 'PGRST302' || // Invalid JWT
           code?.includes('auth');
  }
  return false;
}
