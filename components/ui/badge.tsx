import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badge = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", { variants: { variant: { default: "border-transparent bg-blue-100 text-blue-700", paid: "border-transparent bg-emerald-100 text-emerald-700", overdue: "border-transparent bg-red-100 text-red-700", outline: "text-foreground" } }, defaultVariants: { variant: "default" } });
export function Badge({ className, variant, ...p }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badge>) { return <div className={cn(badge({ variant }), className)} {...p} />; }
