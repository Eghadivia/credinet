import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

export const Toaster = () => {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="light"
      richColors
      closeButton
    />
  );
};

// Export toast from same place
export const toast = sonnerToast;
