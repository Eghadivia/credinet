"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronDown, Phone } from "lucide-react";
import React, { forwardRef, useEffect, useState } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

type Props = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: { mobile_number: string; country_code: string }) => void;
  className?: string;
};

export default function CountryInput({
  id = "phone-input",
  label = "Phone Number",
  value,
  onChange,
  className,
}: Props) {
  const [selectedCountry, setSelectedCountry] =
    useState<RPNInput.Country>("IN");

  // Update country code when country changes
  const updateCountryCode = (phone?: string) => {
    const mobile_number = phone ?? "";
    const country_code = selectedCountry
      ? `+${RPNInput.getCountryCallingCode(selectedCountry)}`
      : "";
    onChange({ mobile_number, country_code });
  };

  useEffect(() => {
    updateCountryCode(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  return (
    <div className={cn("space-y-2 relative px_none", className)} dir="ltr">
      <Label
        htmlFor={id}
        className={cn(
          "absolute -top-2 left-3 rounded-md bg-gray-100 px-1 text-[14px] text-gray-500 transition-colors duration-200",
          "group-hover:text-[#D7AB2F] peer-focus:text-[#D7AB2F]",
        )}
      >
        {label}
      </Label>
      <RPNInput.default
        className="flex w-full bg-gray-100 rounded-lg shadow-sm shadow-black/5"
        international
        flagComponent={FlagComponent}
        defaultCountry="US"
        countryCallingCodeEditable={false}
        countrySelectComponent={(props) => (
          <CountrySelect
            {...props}
            onChange={(country) => {
              props.onChange(country); // First call the internal handler
              setSelectedCountry(country); // Then update state
            }}
          />
        )}
        inputComponent={PhoneInput}
        placeholder="Enter phone number"
        value={value}
        onChange={(phone) => updateCountryCode(phone ?? "")}
      />
    </div>
  );
}

// Restrict input to digits only, no spaces or alphabets
function allowOnlyNumbersAndNoSpace(e: React.KeyboardEvent<HTMLInputElement>) {
  const key = e.key;

  // Allow control keys (Backspace, arrows, Delete, Tab)
  if (
    key === "Backspace" ||
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "Delete" ||
    key === "Tab"
  ) {
    return;
  }

  // Block space
  if (key === " ") {
    e.preventDefault();
    return;
  }

  // Allow digits only (0-9)
  if (!/^\d$/.test(key)) {
    e.preventDefault();
  }
}

const PhoneInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, onKeyDown, ...props }, ref) => {
    // Compose internal and external onKeyDown handlers
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      allowOnlyNumbersAndNoSpace(e);
      if (onKeyDown) onKeyDown(e);
    }

    return (
      <Input
        ref={ref}      
        className={cn(
          "peer rounded-s-none h-auto border-[0px_0px_0px_1px] border-[#D9D9D9] bg-gray-100 p-4 text-lg text-gray-800 placeholder:text-gray-400 transition-colors duration-200 grow",
          "focus:border-[#D7AB2F] focus:ring-2 focus-visible:ring-0",
          "hover:border-[#D7AB2F] peer-focus:border-[#D7AB2F]",
          className,
        )}
        {...props}
        onKeyDown={handleKeyDown}
      />
    );
  },
);
PhoneInput.displayName = "PhoneInput";

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  return (
    <div
      className={cn(
        "relative inline-flex items-center self-stretch rounded-s-lg bg-transparent py-2 pe-2 ps-4 text-muted-foreground hover:text-foreground has-disabled:pointer-events-none has-disabled:opacity-50",
        "w-20",
        "focus:border-[#D7AB2F] focus:ring-2 focus-visible:ring-0",
        "hover:border-[#D7AB2F] peer-focus:border-[#D7AB2F]",
      )}
    >
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        <FlagComponent country={value} countryName={value} aria-hidden="true" />
        <span className="text-muted-foreground/80">
          <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value as RPNInput.Country)}
        className=" absolute inset-0 text-sm opacity-0 outline-none bg-gray-50 ring-0 focus:outline-none focus:ring-0 focus:border-none"
        aria-label="Select country"
      >
        {options
          .filter((x) => x.value)
          .map((option, i) => (
            <option key={option.value ?? `empty-${i}`} value={option.value}>
              {option.label}{" "}
              {option.value &&
                `+${RPNInput.getCountryCallingCode(option.value)}`}
            </option>
          ))}
      </select>
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const FlagIcon = flags[country];
  return (
    <span className="w-5 overflow-hidden rounded">
      {FlagIcon ? (
        <FlagIcon title={countryName || country} />
      ) : (
        <Phone size={16} aria-hidden="true" />
      )}
    </span>
  );
};
