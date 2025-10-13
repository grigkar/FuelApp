import { useEffect } from "react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useToast } from "@/hooks/use-toast";
import { WifiOff, Wifi } from "lucide-react";

/**
 * Component that shows notifications when network status changes
 */
export function NetworkStatusMonitor() {
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Some features may not work until you reconnect.",
        variant: "destructive",
        duration: Infinity, // Keep showing until online
      });
    } else {
      // Only show "back online" if we were previously offline
      const wasOffline = sessionStorage.getItem("was_offline");
      if (wasOffline === "true") {
        toast({
          title: "You're back online",
          description: "Connection restored.",
        });
        sessionStorage.removeItem("was_offline");
      }
    }

    if (!isOnline) {
      sessionStorage.setItem("was_offline", "true");
    }
  }, [isOnline, toast]);

  return null; // This component doesn't render anything
}
