import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";
interface BorderLabelTextareaProps extends React.ComponentProps<"textarea"> {
  label: string;
  id: string;
  labelBgColor: string;
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function BorderLabelTextarea({
  label,
  id,
  className,
  labelBgColor,
  ...props
}: BorderLabelTextareaProps) {
  return (
    <div className="relative group">
      {/* Label */}
      <Label
        htmlFor={id}
        className={cn(
          "absolute -top-2 left-3 rounded-md bg-[#FFFBEF] px-1 text-[14px] text-gray-500 transition-colors duration-200",
          labelBgColor,
          "group-hover:text-[#D7AB2F] peer-focus:text-[#D7AB2F]",
        )}
      >
        {label}
      </Label>

      {/* Textarea */}
      <textarea
        id={id}
        data-slot="textarea"
        className={cn(
          "peer border border-gray-300 rounded-lg bg-[#FFFBEF] p-4 text-lg text-gray-800 placeholder:text-gray-400 transition-colors duration-200",
          "focus:border-[#D7AB2F] focus:ring-2 focus-visible:ring-0",
          "hover:border-[#D7AB2F] peer-focus:border-[#D7AB2F]",
          "min-h-lh max-h-[8lh] text-wrap break-all field-sizing-content w-full resize-y outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export { Textarea, BorderLabelTextarea };
