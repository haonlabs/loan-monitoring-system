"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

function formatInputValue(value: string | number | readonly string[] | undefined): string {
  if (value === undefined || Array.isArray(value)) return "";
  const digits = String(value).replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  if (!digits) return "";
  return `Rp ${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "inputMode"> {}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ defaultValue, onChange, placeholder = "Rp 0", ...props }, ref) => (
    <Input
      {...props}
      ref={ref}
      type="text"
      inputMode="numeric"
      defaultValue={formatInputValue(defaultValue)}
      placeholder={placeholder}
      onChange={event => {
        event.currentTarget.value = formatInputValue(event.currentTarget.value);
        onChange?.(event);
      }}
    />
  )
);
CurrencyInput.displayName = "CurrencyInput";
