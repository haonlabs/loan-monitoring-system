import { ArrowDownRight, Banknote, CircleCheckBig, Clock3, Users } from "lucide-react";
import type { DashboardSummary as Summary } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
export function DashboardSummary({ summary }: { summary: Summary }) {
  const items = [
    { label: "Total piutang", value: formatRupiah(summary.totalReceivable), caption: "Sisa seluruh pinjaman", icon: Banknote, color: "bg-indigo-50 text-indigo-600" },
    { label: "Peminjam aktif", value: summary.activeBorrowers, caption: `dari ${summary.totalBorrowers} peminjam`, icon: Users, color: "bg-violet-50 text-violet-600" },
    { label: "Sudah lunas", value: summary.paidBorrowers, caption: "Seluruh pinjaman lunas", icon: CircleCheckBig, color: "bg-emerald-50 text-emerald-600" },
    { label: "Lewat tempo", value: summary.overdueBorrowers, caption: "Perlu diperhatikan", icon: Clock3, color: "bg-rose-50 text-rose-600" }
  ];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{items.map((i,index)=><Card key={i.label} className={index===0?"border-indigo-100 bg-gradient-to-br from-white to-indigo-50/60":""}><CardContent className="p-5"><div className="flex items-start justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${i.color}`}><i.icon className="h-5 w-5" /></span>{index===0&&<ArrowDownRight className="h-4 w-4 text-indigo-300"/>}</div><p className="mt-5 text-sm font-medium text-muted-foreground">{i.label}</p><p className="mt-1 truncate text-2xl font-bold" title={String(i.value)}>{i.value}</p><p className="mt-1 text-xs text-muted-foreground">{i.caption}</p></CardContent></Card>)}</div>;
}
