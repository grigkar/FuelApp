import { logger } from "./logger";

interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: unknown) => boolean;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  shouldRetry: (error: unknown) => {
    // Retry on network errors, timeouts, and 5xx server errors
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes("network") ||
        message.includes("timeout") ||
        message.includes("fetch") ||
        message.includes("503") ||
        message.includes("502") ||
        message.includes("504")
      );
    }
    return false;
  },
};

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: unknown;
  let delay = opts.delayMs;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      const result = await fn();
      if (attempt > 1) {
        logger.info("Request succeeded after retry", { attempt });
      }
      return result;
    } catch (error) {
      lastError = error;

      const shouldRetry = opts.shouldRetry(error);
      const isLastAttempt = attempt === opts.maxAttempts;

      if (!shouldRetry || isLastAttempt) {
        logger.error(
          `Request failed ${isLastAttempt ? "after all retries" : "(not retryable)"}`,
          error instanceof Error ? error : undefined,
          { attempt, maxAttempts: opts.maxAttempts }
        );
        throw error;
      }

      logger.warn("Request failed, retrying", {
        attempt,
        maxAttempts: opts.maxAttempts,
        nextDelayMs: delay,
        error: error instanceof Error ? error.message : String(error),
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= opts.backoffMultiplier;
    }
  }

  throw lastError;
}

/**
 * Add timeout to a promise
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError?: Error
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () =>
          reject(
            timeoutError || new Error(`Request timeout after ${timeoutMs}ms`)
          ),
        timeoutMs
      )
    ),
  ]);
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("rate limit") ||
      message.includes("too many requests") ||
      message.includes("429")
    );
  }
  return false;
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.toLowerCase().includes("timeout");
  }
  return false;
}
