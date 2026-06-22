import { Banknote, CircleCheckBig, Clock3, Users } from "lucide-react";
import type { DashboardSummary as Summary } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
export function DashboardSummary({ summary }: { summary: Summary }) {
  const items = [
    { label: "Total piutang", value: formatRupiah(summary.totalReceivable), icon: Banknote, color: "bg-blue-50 text-blue-600" },
    { label: "Peminjam aktif", value: summary.activeBorrowers, icon: Users, color: "bg-indigo-50 text-indigo-600" },
    { label: "Sudah lunas", value: summary.paidBorrowers, icon: CircleCheckBig, color: "bg-emerald-50 text-emerald-600" },
    { label: "Jatuh tempo", value: summary.overdueBorrowers, icon: Clock3, color: "bg-red-50 text-red-600" }
  ];
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map(i=><Card key={i.label}><CardContent className="flex items-center gap-4 p-5"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${i.color}`}><i.icon className="h-5 w-5" /></span><div><p className="text-sm text-muted-foreground">{i.label}</p><p className="mt-1 text-xl font-bold">{i.value}</p></div></CardContent></Card>)}</div>;
}
