import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RetryIndicatorProps {
  isRetrying: boolean;
  attempt?: number;
  maxAttempts?: number;
}

/**
 * Visual indicator shown when requests are being retried
 */
export function RetryIndicator({ isRetrying, attempt = 1, maxAttempts = 3 }: RetryIndicatorProps) {
  if (!isRetrying) return null;

  return (
    <Alert className="fixed bottom-4 right-4 w-auto max-w-md z-50">
      <Loader2 className="h-4 w-4 animate-spin" />
      <AlertDescription>
        Retrying request... (Attempt {attempt} of {maxAttempts})
      </AlertDescription>
    </Alert>
  );
}
