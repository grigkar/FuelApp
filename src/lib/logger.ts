// Structured logging utility with correlation IDs

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  correlationId?: string;
  userId?: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

class Logger {
  private static instance: Logger;
  private correlationId: string | null = null;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Generate a unique correlation ID for tracking requests
   */
  generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Set correlation ID for the current context
   */
  setCorrelationId(id: string): void {
    this.correlationId = id;
  }

  /**
   * Get current correlation ID
   */
  getCorrelationId(): string | null {
    return this.correlationId;
  }

  /**
   * Clear correlation ID
   */
  clearCorrelationId(): void {
    this.correlationId = null;
  }

  /**
   * Log a message with structured data
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const correlationId = context?.correlationId || this.correlationId || this.generateCorrelationId();

    const logEntry = {
      timestamp,
      level,
      message,
      correlationId,
      ...context,
    };

    // In production, this would send to a logging service
    // For now, we use console with structured format
    const consoleMethod = level === "error" ? console.error : 
                         level === "warn" ? console.warn : 
                         console.log;

    consoleMethod(JSON.stringify(logEntry, null, 2));
  }

  debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log("error", message, {
      ...context,
      error: error?.message,
      stack: error?.stack,
    });
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Helper function to create scoped loggers for specific components
export function createComponentLogger(componentName: string) {
  return {
    debug: (message: string, context?: LogContext) => 
      logger.debug(message, { ...context, component: componentName }),
    info: (message: string, context?: LogContext) => 
      logger.info(message, { ...context, component: componentName }),
    warn: (message: string, context?: LogContext) => 
      logger.warn(message, { ...context, component: componentName }),
    error: (message: string, error?: Error, context?: LogContext) => 
      logger.error(message, error, { ...context, component: componentName }),
  };
}
