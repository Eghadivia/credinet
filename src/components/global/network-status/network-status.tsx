"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      toast.dismiss();
      toast.success("You are back online!", {
        style: {
          backgroundColor: "#28a745", // Green background for success
          color: "white", // White text for contrast
        },
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.dismiss();
      toast.error("Internet disconnected!", {
        style: {
          backgroundColor: "#dc3545", // Red background for error
          color: "white", // White text for contrast
        },
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null; // Return null if the user is online (no need for a toaster)

  return null; // The toaster is triggered automatically, so we don't need to render anything here
};
