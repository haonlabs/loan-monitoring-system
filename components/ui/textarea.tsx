import * as React from "react";
import { cn } from "@/lib/utils";
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...p }, r) => <textarea ref={r} className={cn("flex min-h-28 w-full rounded-lg border border-input bg-background px-3.5 py-3 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground/75 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/20 disabled:opacity-50", className)} {...p} />); Textarea.displayName="Textarea";
