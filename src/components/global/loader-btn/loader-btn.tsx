import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export default function LoaderBtn({
  className,
  variant,
  size,
  children,
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <Button
      disabled={loading}
      className={cn(buttonVariants({ variant, size, className }), {
        "cursor-pointer opacity-50 cursor-not-allowed": loading,
      })}
      {...props}
    >
      {loading && (
        <LoaderCircle
          className="animate-spin"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
      {children}
    </Button>
  );
}
