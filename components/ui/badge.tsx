import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badge = cva("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", { variants: { variant: { default: "border-indigo-500/20 bg-indigo-500/10 text-indigo-300", paid: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300", overdue: "border-red-500/20 bg-red-500/10 text-red-300", outline: "bg-background text-foreground" } }, defaultVariants: { variant: "default" } });
export function Badge({ className, variant, ...p }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badge>) { return <div className={cn(badge({ variant }), className)} {...p} />; }
