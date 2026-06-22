import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badge = cva("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", { variants: { variant: { default: "border-indigo-100 bg-indigo-50 text-indigo-700", paid: "border-emerald-100 bg-emerald-50 text-emerald-700", overdue: "border-red-100 bg-red-50 text-red-700", outline: "bg-background text-foreground" } }, defaultVariants: { variant: "default" } });
export function Badge({ className, variant, ...p }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badge>) { return <div className={cn(badge({ variant }), className)} {...p} />; }
