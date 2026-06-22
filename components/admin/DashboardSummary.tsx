import { ArrowDownRight, Banknote, CircleCheckBig, Clock3, Users } from "lucide-react";
import type { DashboardSummary as Summary } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
export function DashboardSummary({ summary }: { summary: Summary }) {
  const items = [
    { label: "Total piutang", value: formatRupiah(summary.totalReceivable), caption: "Sisa seluruh pinjaman", icon: Banknote, color: "bg-indigo-500/10 text-indigo-300" },
    { label: "Peminjam aktif", value: summary.activeBorrowers, caption: `dari ${summary.totalBorrowers} peminjam`, icon: Users, color: "bg-violet-500/10 text-violet-300" },
    { label: "Sudah lunas", value: summary.paidBorrowers, caption: "Seluruh pinjaman lunas", icon: CircleCheckBig, color: "bg-emerald-500/10 text-emerald-300" },
    { label: "Lewat tempo", value: summary.overdueBorrowers, caption: "Perlu diperhatikan", icon: Clock3, color: "bg-rose-500/10 text-rose-300" }
  ];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{items.map((i,index)=><Card key={i.label} className={index===0?"border-indigo-500/20 bg-gradient-to-br from-card to-indigo-500/10":""}><CardContent className="p-5"><div className="flex items-start justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${i.color}`}><i.icon className="h-5 w-5" /></span>{index===0&&<ArrowDownRight className="h-4 w-4 text-indigo-300"/>}</div><p className="mt-5 text-sm font-medium text-muted-foreground">{i.label}</p><p className="mt-1 truncate text-2xl font-bold" title={String(i.value)}>{i.value}</p><p className="mt-1 text-xs text-muted-foreground">{i.caption}</p></CardContent></Card>)}</div>;
}
