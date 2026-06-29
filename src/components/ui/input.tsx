import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-lg placeholder:text-[#727070] selection:bg-primary selection:text-primary-foreground bg-input/30 border-input h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base sm:text-lg shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        type !== "date" && "flex",
        className,
      )}
      {...props}
    />
  );
}

function BorderLabelInput(
  props: React.ComponentProps<typeof Input> & {
    label: string;
    id: string;
    labelBgColor?: string;
  },
) {
  const { label, id, className, labelBgColor = "bg-gray-100", ...rest } = props;

  return (
    <div className="relative group">
      {/* Label */}
      <Label
        htmlFor={id}
        className={cn(
          "absolute -top-2 left-3 rounded-md px-1 text-[14px] text-gray-500 transition-colors duration-200",
          labelBgColor,
          "group-hover:text-[#D7AB2F] peer-focus:text-[#D7AB2F]",
        )}
      >
        {label}
      </Label>

      {/* Input */}
      <Input
        id={id}
        {...rest}
        className={cn(
          "peer rounded-lg h-auto border border-gray-300 bg-gray-100 p-4 text-lg text-gray-800 placeholder:text-gray-400 transition-colors duration-200",
          "focus:border-[#D7AB2F] focus:ring-2 focus-visible:ring-0",
          "hover:border-[#D7AB2F] peer-focus:border-[#D7AB2F]",
          className,
        )}
      />
    </div>
  );
}

export { Input, BorderLabelInput };
