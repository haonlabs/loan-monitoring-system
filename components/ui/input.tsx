import * as React from "react";
import { cn } from "@/lib/utils";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, r) => <input ref={r} className={cn("flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground/75 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50", className)} {...p} />); Input.displayName="Input";
