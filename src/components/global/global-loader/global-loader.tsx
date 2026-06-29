"use client";

import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface LoadingContextType {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export function GlobalLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When the route actually changes, stop the overlay.
    setLoading(false);
  }, [pathname]);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#EE1C25] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
